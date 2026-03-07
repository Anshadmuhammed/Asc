import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are an expert Educational Counselor for ASC (Ascetic Edu Solution). 
Your identity: You are NOT a specific college or university. You are an educational consultancy guiding students toward admission into various premier institutions.
Help students with:
1. Answering queries related to higher education, choosing the right courses, and career paths.
2. Clearing doubts about suitable colleges and universities.
3. Guiding them to fill out the ASC "Begin Your Journey" registration form to schedule a personalized session.
CRITICAL RULES:
- NEVER use markdown like **bold**, *italics*, or # headings. Always respond in pure plain text only.
- Write extremely short responses (1-2 sentences maximum). This makes your responses seem lightning fast and conversational like WhatsApp.
- Keep your answers highly concise, friendly, and focused.`;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am the ASC Educational Counselor. How can I help guide your higher education journey today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const chatSessionRef = useRef(null);

    useEffect(() => {
        // Show tooltip automatically to casually notify the user there is a bot
        const timer = setTimeout(() => setShowTooltip(true), 2500);

        // Initialize standard chat session if API key exists
        if (genAI && !chatSessionRef.current) {
            try {
                const model = genAI.getGenerativeModel({
                    model: "gemini-flash-latest",
                    systemInstruction: SYSTEM_PROMPT,
                });
                chatSessionRef.current = model.startChat({
                    history: [],
                });
            } catch (err) {
                console.error("Failed to initialize Gemini model:", err);
            }
        }
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInputMessage('');
        setIsTyping(true);

        if (!genAI || !chatSessionRef.current) {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'model', text: 'Error: API key is missing or model failed to initialize. Please check your .env file.' }]);
            return;
        }

        try {
            const result = await chatSessionRef.current.sendMessageStream(userMsg);

            // Add an empty message placeholder that we will smoothly stream text into
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of result.stream) {
                // Clear the typing dots as soon as the first word streams in!
                setIsTyping(false);

                const chunkText = chunk.text();
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;

                    if (newMessages[lastIndex].role === 'model') {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            text: newMessages[lastIndex].text + chunkText
                        };
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage = error.message || "Unknown API Connection issue.";
            setMessages(prev => [...prev, { role: 'model', text: `Sorry, there was an API connection error: ${errorMessage}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Action Button with Dynamic Tooltip */}
            <div style={{ position: 'fixed', bottom: '2rem', right: '8rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Pop-up Notification Balloon */}
                <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '-10px',
                    background: 'var(--color-gold)',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                    opacity: showTooltip && !isOpen ? 1 : 0,
                    transform: showTooltip && !isOpen ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                    pointerEvents: showTooltip && !isOpen ? 'auto' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    Questions? Chat with me! 💬
                    <div style={{ position: 'absolute', bottom: '-5px', right: '35px', width: '10px', height: '10px', background: 'var(--color-gold)', transform: 'rotate(45deg)' }}></div>
                </div>

                <button
                    onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
                    className="glass"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--color-gold)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        backgroundColor: isOpen ? 'var(--color-charcoal)' : 'rgba(10, 25, 47, 0.7)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isOpen ? <X size={28} color="var(--color-gold)" /> : <MessageSquare size={28} color="var(--color-gold)" />}
                </button>
            </div>

            {/* Chat Window Popup */}
            {isOpen && (
                <div
                    className="glass-dark"
                    style={{
                        position: 'fixed',
                        bottom: '6.5rem',
                        right: '8rem',
                        zIndex: 9999,
                        width: 'clamp(300px, 90vw, 380px)',
                        height: '500px',
                        maxHeight: '75vh',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        animation: 'slideUp 0.3s ease-out'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(0,0,0,0.2)'
                    }}>
                        <MessageSquare size={20} color="var(--color-gold)" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-offwhite)' }}>ASC Assistant</h3>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                backgroundColor: msg.role === 'user' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                border: msg.role === 'user' ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--color-offwhite)',
                                fontSize: '0.95rem',
                                lineHeight: '1.4',
                                whiteSpace: 'pre-wrap' // Safely honors newlines mimicking standard chat apps
                            }}>
                                {/* Systematically scrub out hallucinated markdown tags (like bold ** or list *) */}
                                {msg.text.replace(/\*/g, '').replace(/#/g, '')}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '0.75rem 1rem',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                gap: '4px',
                                alignItems: 'center'
                            }}>
                                <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                                <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
                                <div className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gold)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form
                        onSubmit={handleSendMessage}
                        style={{
                            padding: '1rem',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            gap: '8px',
                            backgroundColor: 'rgba(0,0,0,0.2)'
                        }}
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask me anything..."
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isTyping}
                            style={{
                                padding: '0 1rem',
                                borderRadius: '8px',
                                background: 'var(--color-gold)',
                                border: 'none',
                                color: '#fff',
                                cursor: isTyping ? 'not-allowed' : 'pointer',
                                opacity: isTyping ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </form>

                    <style dangerouslySetInnerHTML={{
                        __html: `
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes bounce {
              0%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-4px); }
            }
          `}} />
                </div>
            )}
        </>
    );
}
