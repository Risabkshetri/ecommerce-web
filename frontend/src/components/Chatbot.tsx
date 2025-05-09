'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import electronicsGadgets from "../../data/dummydata.json"

import { 
  XIcon, 
  SendIcon, 
  SparklesIcon,
  BrainIcon,
  MessageSquareIcon 
} from "lucide-react";
import { Badge } from './ui/badge';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'system';
  content: string;
  thinking?: string;
  response?: string;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: Message;
  }>;
}

const AIChatbot: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setProducts(electronicsGadgets)
  }, []);
  
  const companyContextPrompt: string = `

You are an AI assistant for Electro Store. You have access to the following product catalog:

[PRODUCT_CATALOG]
${JSON.stringify(products, null, 2)}
[/PRODUCT_CATALOG]

Structure your responses in the following format:
[THINKING]
First, provide your thought process about the question in 2-3 sentences.

[RESPONSE]
Then provide your actual response using:
- Clear headings with ###
- Bullet points for lists
- **Bold** for important items
- Organized paragraphs
- Tables where relevant

Example format:
[THINKING]
Let me analyze the available smartphone options in our inventory and consider the customer's budget range.

[RESPONSE]
### Recommended Smartphones
Here are the best options within your budget:

* **iPhone 13** - ₹54,999
  - A15 Bionic chip
  - Excellent camera system

* **Samsung S21 FE** - ₹49,999
  - Snapdragon 888
  - 120Hz AMOLED display

### Delivery Information
We offer free delivery in Faridabad within 24 hours.

End your response with a relevant follow-up question if needed.
`;

  const initialMessages: Message[] = [
    {
      role: 'system',
      content: "👋 Hello! I'm Electro Store's intelligent assistant. How can I help you today?"
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseResponse = (content: string): { thinking?: string; response?: string } => {
    const thinkingMatch = content.match(/\[THINKING\](.*?)(?=\[RESPONSE\])/s);
    const responseMatch = content.match(/\[RESPONSE\](.*?)$/s);
    
    return {
      thinking: thinkingMatch ? thinkingMatch[1].trim() : undefined,
      response: responseMatch ? responseMatch[1].trim() : content.trim()
    };
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
        const conversationHistory = messages.map(msg => {
        if (msg.role === 'user') {
          return { role: 'user', content: msg.content } as Message;
        } else {
          
          return { role: 'system', content: msg.content } as Message;
        }
      }).filter((msg: Message) => msg.role !== 'system' || messages.indexOf(msg) === 0);

      const apiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-llama-70b",
          messages: [
            { role: 'system', content: companyContextPrompt },
            ...conversationHistory,
            { role: 'user', content: inputMessage }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data: ChatCompletionResponse = await apiResponse.json();
      const { thinking, response: parsedResponse } = parseResponse(data.choices[0].message.content);
      const aiResponse: Message = {
        role: 'system',
        content: data.choices[0].message.content,
        thinking,
        response: parsedResponse
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: '❌ Sorry, there was an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageContent: React.FC<{ message: Message }> = ({ message }) => {
    if (message.role === 'user') {
      return <div>{message.content}</div>;
    }

    if (!message.thinking && !message.response) {
      return <div>{message.content}</div>;
    }

    return (
      <div className="space-y-4">
        {message.thinking && (
          <div className="flex items-start space-x-2 border-l-2 border-yellow-500 pl-3">
            <BrainIcon className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
            <div className="text-gray-300 italic">{message.thinking}</div>
          </div>
        )}
        {message.response && (
          <div className="flex items-start space-x-2">
            <MessageSquareIcon className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
            <ReactMarkdown
              className="prose prose-invert prose-sm max-w-none"
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="mb-2 last:mb-0 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="mb-2 last:mb-0 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-4">{children}</li>,
                h3: ({ children }) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                table: ({ children }) => (
                  <div className="overflow-x-auto">
                    <table className="border-collapse table-auto w-full text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="border border-gray-600 px-4 py-2 text-left">{children}</th>,
                td: ({ children }) => <td className="border border-gray-600 px-4 py-2">{children}</td>,
              }}
            >
              {message.response}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-transparent hover:bg-transparent text-3xl flex flex-col shadow-xl z-50"
      > 
        <Badge variant="outline" className="mb-1 bg-purple-700 text-white py-2 px-4">
          AI Assistant
        </Badge>
        <span className="shadow-xl">🤖</span>
      </Button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100] pr-6"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-200 w-full max-w-md h-[600px] rounded-xl shadow-2xl flex flex-col self-end mb-20"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-6 w-6 text-blue-400" />
                  <h2 className="text-xl font-semibold text-black">Electro Store Assistant</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)}>
                  <XIcon className="h-6 w-6 text-gray-800 hover:text-white" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-violet-600 text-white' 
                          : 'bg-purple-200 text-gray-800'
                      }`}
                    >
                      <MessageContent message={msg} />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-purple-600 p-3 rounded-xl">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-700 flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about our services..."
                  className="flex-grow bg-gray-300 text-gray-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading}
                  className="bg-violet-800 hover:bg-violet-700 text-white"
                >
                  <SendIcon className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;