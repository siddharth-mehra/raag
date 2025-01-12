'use client'
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { X, MessageCircle, Send, Loader2, ArrowDownCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@ai-sdk/react';
import { Button } from '../components/ui/button';

interface CodeProps {
  inline?: boolean;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const Gemini = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showChatIcon, setIsChatIcon] = useState(false);
  const chatIconRef = useRef<HTMLButtonElement>(null);
  const { messages, input, handleInputChange, isLoading, handleSubmit, stop, reload, error } = useChat({ api: '/api/gemini' });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsChatIcon(true);
      } else {
        setIsChatIcon(false);
        setIsChatOpen(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }

  return (
    <div>
      <AnimatePresence>
        {showChatIcon && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 cursor-pointer z-50"
            onClick={toggleChat}
          >
            <Button ref={chatIconRef} onClick={toggleChat} className="rounded-full size-14 p-2 shadow-lg">
              {isChatOpen ? <ArrowDownCircleIcon /> : <MessageCircle className="size-6" />}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 cursor-pointer z-50 w-[300px] md:w-[40%] lg:w-[500px]"
          >
            <Card className="border-2 bg-black/[0.8] text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-bold">RAAG Bot</CardTitle>
                <Button onClick={toggleChat} size="icon" variant="ghost" className="px-2 py-0">
                  <X className="size-4" />
                  <span className="sr-only">Close Chat</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4 overflow-auto">
                  {messages?.length === 0 && (
                    <div className="w-full mt-32 text-gray-500 items-center justify-center flex gap-3">
                      No messages yet.
                    </div>
                  )}
                  {messages?.map((message, index) => (
                    <div key={index} className={`mb-4 p-1 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div className={`inline-block p-1 rounded-lg ${message.role === "user" ? "bg-slate-700" : "bg-muted"}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, children, ...props }: CodeProps) {
                              return inline ? (
                                <code {...props} className="bg-gray-200 px-1 rounded">
                                  {children}
                                </code>
                              ) : (
                                <pre {...props} className="bg-gray-200 px-2 rounded">
                                  <code>{children}</code>
                                </pre>
                              );
                            },
                            ul({ children }) {
                              return <ul className="list-disc ml-4">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal ml-4">{children}</ol>;
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="w-full flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin size-4 text-primary" />
                      <button className="underline" type="button" onClick={() => stop()}>
                        Abort
                      </button>
                    </div>
                  )}
                  {error && (
                    <div className="w-full flex items-center justify-center gap-3">
                      <div>An error occurred</div>
                      <button className="underline" type="button" onClick={() => reload()}>
                        Retry
                      </button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
              <form onSubmit={handleSubmit} className="flex w-full items-center">
                <Input
                  className="flex-1 m-4"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                />
                <Button type="submit" className="size-9 bg-white text-black mr-3" size="icon" disabled={isLoading}>
                  <Send className="size-9" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gemini;

