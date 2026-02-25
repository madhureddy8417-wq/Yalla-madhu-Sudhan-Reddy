'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, X, Send, User, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  "How to pay property tax?",
  "Garbage collection schedule for Ward 47",
  "Report a broken street light",
  "Emergency contact numbers",
];

export default function AIChatBot({ isEmergencyMode }: { isEmergencyMode: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! I am Municipal Mitra, your smart municipal assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      const query = e.detail;
      setIsOpen(true);
      if (query) {
        // Use a small delay to ensure the component is open and state can be updated
        setTimeout(() => {
          handleSend(query);
        }, 300);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = messageToSend.trim();
    if (!overrideInput) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      // Add a placeholder for the model's response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are Municipal Mitra, the official AI assistant for the SMART MUNICIPAL MITRA platform, a cutting-edge municipal governance system for Vijayawada, Andhra Pradesh.

Your primary goal is to provide accurate information based on the following platform FAQs and knowledge base:

### PLATFORM KNOWLEDGE BASE & FAQs:

1. **Registering Complaints:**
   - Users can register complaints via the "Register Complaint" button on the Dashboard or through the "Citizen Services" tab.
   - For AI-powered reporting, use the "AI Verify" tab to upload a photo; the system will automatically detect the issue type (e.g., pothole, garbage) and geotag the location.

2. **Tracking Services:**
   - **Garbage Vehicles:** Use the "Smart Routing" tab to see real-time GPS locations of all municipal vehicles.
   - **Complaint Status:** Click "Track Status" on the Dashboard or visit the "Citizen Services" section to see the progress of your reported issues.

3. **AI Detection Capabilities:**
   - The platform uses Edge AI to automatically detect: Garbage Piles, Overflow Drains, Broken Streetlights, Potholes, and Unauthorized Encroachments.
   - These are monitored via 360° cameras mounted on municipal vehicles.

4. **Payments & Taxes:**
   - Property tax, water tax, and other municipal dues can be paid under the "Citizen Services" tab.
   - Users can also download receipts and view payment history there.

5. **Emergency Mode:**
   - When activated, the platform shifts to a high-alert red theme.
   - It prioritizes emergency alerts (like heavy rain or fire) and provides one-tap access to the Commissioner's Office and emergency responders.

6. **Ward Dashboard:**
   - This section provides ward-wise performance metrics, resolution rates, and coverage statistics.

### OPERATIONAL GUIDELINES:
- **Tone:** Professional, helpful, and efficient.
- **Formatting:** Use Markdown (headers, bold text, lists) for clarity.
- **Conciseness:** Keep responses brief but informative.
- **Emergency:** If a user reports a life-threatening emergency, instruct them to use the "Emergency Mode" button immediately and provide the Vijayawada Municipal Corporation (VMC) emergency helpline: 0866-2422400.
- **Context:** Always assume the user is in Vijayawada, Andhra Pradesh.

### EXAMPLE INTERACTIONS:

**User:** How do I report a pothole?
**Municipal Mitra:** You can report a pothole in two ways:
1. **AI Verify:** Go to the "AI Verify" tab and upload a photo. Our AI will automatically detect the pothole and geotag its location for the engineering team.
2. **Manual:** Click the "Register Complaint" button on your Dashboard and select "Roads/Potholes" as the category.

**User:** Where is the garbage truck?
**Municipal Mitra:** You can track all municipal vehicles in real-time! Simply navigate to the **"Smart Routing"** tab. You'll see a live map showing the GPS locations of all active garbage collection vans and their current routes.

**User:** I want to pay my property tax.
**Municipal Mitra:** Property tax payments are handled under the **"Citizen Services"** tab. Once there, select "Property Tax" to view your dues, make a payment, and download your official receipt.`,
        },
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the municipal servers. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 sm:w-96 h-[600px] bg-white border border-black/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`p-5 flex items-center justify-between ${isEmergencyMode ? 'bg-red-600' : 'bg-gradient-to-r from-blue-600 to-emerald-600'} shadow-lg`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Brain className="text-white" size={22} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-rajdhani tracking-wider">Municipal Mitra AI</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-bold">Smart Assistant</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 no-scrollbar bg-slate-50/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-white border border-black/5'
                    }`}>
                      {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-blue-600" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-700 border border-black/5 rounded-tl-none'
                    }`}>
                      {msg.role === 'model' ? (
                        <div className="markdown-body prose prose-slate prose-xs max-w-none">
                          <Markdown remarkPlugins={[remarkGfm]}>{msg.text || (isLoading && i === messages.length - 1 ? '...' : '')}</Markdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1].text === '' && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-xl bg-white border border-black/5 flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-blue-600" />
                    </div>
                    <div className="bg-white border border-black/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                      <Loader2 size={14} className="text-blue-600 animate-spin" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 py-3 bg-slate-50 border-t border-black/5 space-y-2">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={10} className="text-blue-600" /> Suggested Questions
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); }}
                      className="text-[9px] bg-white hover:bg-slate-50 border border-black/5 text-slate-500 hover:text-blue-600 px-3 py-1.5 rounded-full transition-all shadow-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-5 border-t border-black/5 bg-white">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..." 
                  className="w-full bg-slate-50 border border-black/10 rounded-2xl px-5 py-4 pr-14 text-xs text-slate-900 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-400"
                />
                <button 
                  id="ai-send-button"
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/20"
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="mt-3 text-[8px] text-center text-slate-400 uppercase font-bold tracking-[0.3em] flex items-center justify-center gap-2">
                <MessageSquare size={10} /> Municipal AI Core v2.0
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all relative group ${
          isEmergencyMode ? 'bg-red-600' : 'bg-gradient-to-br from-blue-600 to-emerald-600'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300" />
        <Brain className="text-white" size={28} />
        {isOpen ? (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
            <X size={12} className="text-blue-600" />
          </div>
        ) : (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#060d1a] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
