import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Message, Product, Order } from "../types";
import { processCustomerMessage } from "../services/geminiService";
import { toast } from "sonner";
import { Bot, User, Send } from "lucide-react";

interface MessagesViewProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inventory: Product[];
  setInventory: React.Dispatch<React.SetStateAction<Product[]>>;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

export function MessagesView({ messages, setMessages, inventory, setInventory, setOrders }: MessagesViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      text: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const inventoryContext = inventory.map(i => `${i.name} (Stock: ${i.stock}, Price: $${i.price})`).join('\n');
      
      const aiResponse = await processCustomerMessage(userMessage.text, inventoryContext);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse.reply,
        timestamp: new Date().toISOString(),
        classification: aiResponse.classification,
        suggestedAction: aiResponse.suggestedAction,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If it's an order, process it
      if (aiResponse.classification === 'order' && aiResponse.extractedOrder) {
        const { extractedOrder } = aiResponse;
        
        let total = 0;
        let canFulfill = true;
        const updatedInventory = [...inventory];

        for (const item of extractedOrder.items) {
          const productIndex = updatedInventory.findIndex(p => p.name.toLowerCase() === item.productName.toLowerCase());
          if (productIndex !== -1) {
            const product = updatedInventory[productIndex];
            if (product.stock >= item.quantity) {
              total += product.price * item.quantity;
              updatedInventory[productIndex] = { ...product, stock: product.stock - item.quantity };
            } else {
              canFulfill = false;
              toast.error(`Insufficient stock for ${item.productName}`);
            }
          } else {
            canFulfill = false;
            toast.error(`Product not found: ${item.productName}`);
          }
        }

        if (canFulfill && extractedOrder.items.length > 0) {
          const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 10000)}`,
            customerName: extractedOrder.customerName || 'Unknown Customer',
            customerContact: extractedOrder.customerContact,
            items: extractedOrder.items,
            status: 'pending',
            total,
            createdAt: new Date().toISOString(),
          };
          setOrders((prev) => [newOrder, ...prev]);
          setInventory(updatedInventory);
          toast.success('New order created and inventory updated!');
        }
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to process message with AI.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle>Customer Communications</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden relative">
        <ScrollArea className="h-full p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${msg.sender === 'customer' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'customer' ? 'bg-neutral-200 text-neutral-600' : 
                    msg.sender === 'system' ? 'bg-blue-100 text-blue-600' : 'bg-neutral-900 text-white'
                  }`}>
                    {msg.sender === 'customer' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.sender === 'customer' 
                        ? 'bg-neutral-900 text-white rounded-tr-sm' 
                        : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-sm shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.classification && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs bg-white">
                          {msg.classification}
                        </Badge>
                        {msg.suggestedAction && (
                          <Badge variant="secondary" className="text-xs">
                            Action: {msg.suggestedAction}
                          </Badge>
                        )}
                      </div>
                    )}
                    <span className="text-xs text-neutral-400 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white border border-neutral-200 rounded-tl-sm shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4 bg-neutral-50">
        <form 
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Simulate an incoming customer message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-white"
          />
          <Button type="submit" disabled={isProcessing || !inputValue.trim()}>
            <Send size={18} className="mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
