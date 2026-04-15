import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProcessedMessage {
  classification: "order" | "inquiry" | "complaint" | "support" | "other";
  reply: string;
  extractedOrder?: {
    customerName?: string;
    customerContact?: string;
    items: {
      productName: string;
      quantity: number;
    }[];
  };
  suggestedAction?: string;
}

export async function processCustomerMessage(
  message: string,
  inventoryContext: string
): Promise<ProcessedMessage> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
You are an advanced Autonomous Business AI Agent designed to assist small and medium businesses.
Your responsibilities include communication handling, order management, inventory management, and customer support.

Current Inventory Context:
${inventoryContext}

Incoming Customer Message:
"${message}"

Analyze the message and provide:
1. Classification (order, inquiry, complaint, support, or other).
2. A professional and context-aware reply to the customer. If it's an order and stock is insufficient based on the inventory context, politely inform them. If information is missing, ask clarifying questions.
3. If it's an order, extract the order details (customer name, contact, items with product name and quantity).
4. A suggested action for the business owner (e.g., "Fulfill order", "Follow up on complaint", "Restock item").

Respond strictly in the requested JSON format.
`,
    config: {
      systemInstruction: "You are a concise, professional, and business-friendly AI assistant.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          classification: {
            type: Type.STRING,
            description: "The category of the message",
            enum: ["order", "inquiry", "complaint", "support", "other"],
          },
          reply: {
            type: Type.STRING,
            description: "The professional reply to send back to the customer",
          },
          extractedOrder: {
            type: Type.OBJECT,
            description: "Extracted order details, if applicable",
            properties: {
              customerName: { type: Type.STRING },
              customerContact: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productName: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                  },
                  required: ["productName", "quantity"],
                },
              },
            },
          },
          suggestedAction: {
            type: Type.STRING,
            description: "Suggested action for the business owner",
          },
        },
        required: ["classification", "reply"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(text) as ProcessedMessage;
}

export async function generateDailyReport(
  orders: any[],
  inventory: any[],
  messages: any[]
): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Generate a concise daily business report based on the following data.

Orders Today:
${JSON.stringify(orders, null, 2)}

Current Inventory:
${JSON.stringify(inventory, null, 2)}

Recent Messages/Interactions:
${JSON.stringify(messages, null, 2)}

Include:
- Total orders and revenue summary (estimate revenue if prices aren't explicit, or just state total items sold).
- Top products.
- Pending tasks (e.g., low stock alerts, unresolved complaints).
- A brief encouraging summary.

Format as clean Markdown.
`,
  });

  return response.text || "Failed to generate report.";
}
