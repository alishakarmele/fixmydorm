/**
 * FixMyDorm - AI Help Agent Page
 *
 * Chat interface for the hostel AI assistant.
 * Powered by Amazon Bedrock (Claude) with fallback.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  BotMessageSquare,
  Send,
  Loader2,
  User,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "How do I file a complaint?",
  "I lost my water bottle",
  "How to request late entry?",
  "What's for lunch today?",
  "Hostel rules for guests",
];

export default function AIHelpPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! 👋 I'm the FixMyDorm AI assistant. I can help you with complaints, lost items, leave requests, mess info, and hostel rules. What do you need?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const message = text || input.trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.slice(-10),
        }),
      });

      const data = await res.json();
      const reply = data.success
        ? data.data.reply
        : "Sorry, I'm having trouble right now. Please try again!";

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BotMessageSquare className="h-6 w-6" />
          AI Help Agent
        </h1>
        <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Powered by Amazon Bedrock
        </p>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-y-auto p-4 space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted"
              }`}
            >
              {msg.role === "assistant" ? (
                <BotMessageSquare className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted rounded-tl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BotMessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Suggestions (show when no messages from user yet) */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-full border bg-background px-3 py-1.5 text-xs hover:bg-muted transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Ask anything about hostel life..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
