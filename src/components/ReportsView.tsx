import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Product, Order, Message } from "../types";
import { generateDailyReport } from "../services/geminiService";
import { Loader2, FileText } from "lucide-react";
import Markdown from "react-markdown";

interface ReportsViewProps {
  inventory: Product[];
  orders: Order[];
  messages: Message[];
}

export function ReportsView({ inventory, orders, messages }: ReportsViewProps) {
  const [report, setReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const generatedReport = await generateDailyReport(orders, inventory, messages);
      setReport(generatedReport);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Reports</CardTitle>
          <CardDescription>Generate AI-powered daily summaries of your business operations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Daily Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Summary Report</CardTitle>
            <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral max-w-none prose-sm sm:prose-base">
              <Markdown>{report}</Markdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
