"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "bot"
    content: string
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: "bot", content: "Hello! I am your Library AI assistant. How can I help you today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            // Assuming authentication is handled via cookies or interceptors automatically
            // We might need to fetch the user_id from context or storage if the API requires it explicitly
            // For now, I'll use a placeholder or assume the backend extracts it from the token if possible
            // But based on my previous schema, I require 'user_id' in the body.  
            // I will attempt to get it from localStorage or just send "frontend_user" if I can't find it easily.
            // Ideally this comes from an Auth Context.
            const userId = localStorage.getItem("user_id") || "anonymous_user";

            const response = await fetch("http://localhost:8000/req/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                    message: userMessage,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to send message")
            }

            const data = await response.json()
            setMessages(prev => [...prev, { role: "bot", content: data.response }])
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-xl border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary" />
                            <CardTitle className="text-md font-bold">Library AI</CardTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "flex items-start gap-2 max-w-[85%]",
                                            msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                        )}
                                    >
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === "user" ? "bg-primary" : "bg-muted"
                                        )}>
                                            {msg.role === "user" ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div
                                            className={cn(
                                                "rounded-lg px-3 py-2 text-sm",
                                                msg.role === "user"
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-start gap-2 max-w-[85%]">
                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                                            <span className="animate-pulse">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 border-t">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSend()
                            }}
                            className="flex w-full gap-2"
                        >
                            <Input
                                placeholder="Ask about books..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1"

                            />
                            <Button type="submit" size="icon" disabled={isLoading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
