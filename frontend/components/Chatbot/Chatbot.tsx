"use client";

import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import { Send } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hello! I am your AI Library Assistant. How can I help you today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // TODO: Replace with actual API call to backend agent
            // const response = await fetch('/api/chat', { ... });

            // Simulating response for now
            setTimeout(() => {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "I'm currently being connected to the backend services. Once fully operational, I'll be able to help you search for books, check due dates, and more!",
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiMessage]);
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Failed to send message:', error);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span>✨</span> AI Assistant
                </h3>
                <p className="text-blue-100 text-xs opacity-90">Powered by Gemini</p>
            </div>

            {/* Chat Area */}
            <ChatWindow messages={messages} isLoading={isLoading} />

            {/* Input Area */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-end gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask about books, due dates..."
                        className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 text-sm p-2 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                        rows={1}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex-shrink-0"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
