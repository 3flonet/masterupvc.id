"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, MessageCircle } from "lucide-react";
import { getSettings, WebsiteSettings } from "@/utils/db";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
  time: string;
}

function extractName(input: string): string {
  let name = input.trim();
  
  // 1. Remove common greetings & fillers at the beginning (e.g. "hallo juga, ")
  const greetings = [
    /^(hallo juga|halo juga|hai juga|hi juga)\b/i,
    /^(selamat pagi|selamat siang|selamat sore|selamat malam)\b/i,
    /^(assalamu'alaikum|assalamualaikum)\b/i,
    /^(hallo|halo|hai|hi|hei)\b/i
  ];
  
  for (const regex of greetings) {
    if (regex.test(name)) {
      name = name.replace(regex, "");
      break;
    }
  }

  // Trim and remove optional callouts/salutations (e.g. "min", "kak", "admin") at the beginning
  name = name.trim();
  const salutations = /^(min|admin|kak|kakak|kaka|gan|agan|sis|sist|sista|bos|boss|mas|mbak|pak|bapak|bu|ibu)\b[,.\s-]*/i;
  if (salutations.test(name)) {
    name = name.replace(salutations, "");
  }

  // 2. Remove common name prefixes
  const prefixes = [
    /^(nama saya adalah)\s+/i,
    /^(nama saya)\s+/i,
    /^(panggil saya)\s+/i,
    /^(nama ku adalah)\s+/i,
    /^(namaku adalah)\s+/i,
    /^(nama ku)\s+/i,
    /^(namaku)\s+/i,
    /^(saya dengan)\s+/i,
    /^(dengan saya)\s+/i,
    /^(disini dengan|di sini dengan)\s+/i,
    /^(dengan)\s+/i,
    /^(saya adalah)\s+/i,
    /^(saya)\s+/i,
    /^(aku adalah)\s+/i,
    /^(aku)\s+/i
  ];

  for (const regex of prefixes) {
    if (regex.test(name.trim())) {
      name = name.trim().replace(regex, "");
      break;
    }
  }

  // Capitalize first letter of each word
  return name.trim().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [step, setStep] = useState(0); // 0: Greeting, 1: Name, 2: Phone, 3: Email, 4: Reason, 5: Success/Redirect
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Captured Leads Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [prefillReason, setPrefillReason] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load Settings
  useEffect(() => {
    async function loadSettings() {
      const data = await getSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  // Listen to open_chatbot event
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      const reasonVal = customEvent.detail?.reason || "";
      if (reasonVal) {
        setPrefillReason(reasonVal);
      }
      setIsOpen(true);
    };
    window.addEventListener("open_chatbot", handleOpen);
    return () => window.removeEventListener("open_chatbot", handleOpen);
  }, []);

  // Autofill user input when step becomes 4 (asking for reason) if prefillReason exists
  useEffect(() => {
    if (step === 4 && prefillReason) {
      setUserInput(prefillReason);
    }
  }, [step, prefillReason]);

  // Listen to cart drawer toggle to hide chatbot
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      const isOpen = !!customEvent.detail?.isOpen;
      setIsCartDrawerOpen(isOpen);
      if (isOpen) {
        setIsOpen(false); // Close chatbot window if open
      }
    };
    window.addEventListener("cart_drawer_toggle", handleToggle);
    return () => window.removeEventListener("cart_drawer_toggle", handleToggle);
  }, []);

  // Trigger initial bot greeting when settings are loaded and chat is first opened
  useEffect(() => {
    if (isOpen && settings && settings.chatbot_active && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages([
          {
            id: "greeting",
            type: "bot",
            text: settings.chatbot_initial_greeting || "Halo! Saya Nadia, asisten virtual Master UPVC. Ada yang bisa saya bantu hari ini? 😊",
            time: timeStr
          }
        ]);
        setIsTyping(false);
        setStep(1); // Ready to ask for Name next
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, settings]);

  // Prompt the next question after the user answers
  useEffect(() => {
    if (step === 1 && messages.length === 1 && messages[0].type === "bot") {
      // Prompt Name
      setIsTyping(true);
      const timer = setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [
          ...prev,
          {
            id: "ask_name",
            type: "bot",
            text: settings?.chatbot_ask_name_message || "Boleh tahu siapa nama Anda?",
            time: timeStr
          }
        ]);
        setIsTyping(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [step, messages, settings]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!settings || !settings.chatbot_active || isCartDrawerOpen) return null;

  const botName = settings.chatbot_name || "Nadia";
  const botAvatar = settings.chatbot_avatar || null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const input = userInput.trim();
    setUserInput("");

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type: "user",
        text: input,
        time: timeStr
      }
    ]);

    setIsTyping(true);

    // Flow Logic
    if (step === 1) {
      // User entered Name
      if (input.length < 2) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: "bot",
              text: "Maaf, namanya sepertinya terlalu pendek. Boleh tuliskan nama lengkap Anda? 😊",
              time: timeStr
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      const extractedName = extractName(input);
      setName(extractedName);
      setStep(2);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: "bot",
            text: `Halo ${extractedName}! ${settings.chatbot_ask_phone_message || "Boleh minta nomor WhatsApp Anda yang aktif? (Contoh: 08123456789)"}`,
            time: timeStr
          }
        ]);
        setIsTyping(false);
      }, 1200);
    } 
    else if (step === 2) {
      // User entered Phone
      const cleanedPhone = input.replace(/[^0-9]/g, "");
      if (cleanedPhone.length < 9 || cleanedPhone.length > 15) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: "bot",
              text: "Maaf, sepertinya format nomor WhatsApp Anda salah. Mohon masukkan nomor yang valid ya (contoh: 08123456789) 😊",
              time: timeStr
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      setPhone(input);
      setStep(3);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: "bot",
            text: settings.chatbot_ask_email_message || "Bisa infokan juga alamat email Anda?",
            time: timeStr
          }
        ]);
        setIsTyping(false);
      }, 1200);
    } 
    else if (step === 3) {
      // User entered Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: "bot",
              text: "Ups! Format emailnya sepertinya kurang tepat. Mohon masukkan alamat email yang benar ya (contoh: nama@email.com) 😊",
              time: timeStr
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      setEmail(input);
      setStep(4);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: "bot",
            text: settings.chatbot_ask_reason_message || "Terima kasih! Silakan ceritakan apa yang ingin Anda konsultasikan atau tanyakan mengenai pintu & jendela UPVC?",
            time: timeStr
          }
        ]);
        setIsTyping(false);
      }, 1200);
    } 
    else if (step === 4) {
      // User entered Consultation Reason
      if (input.length < 8) {
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              type: "bot",
              text: "Bisa diceritakan sedikit lebih detail lagi alasannya? Agar kami bisa membantu Anda dengan lebih baik 😊",
              time: timeStr
            }
          ]);
          setIsTyping(false);
        }, 1000);
        return;
      }

      setReason(input);
      setStep(5);

      // Save to database & trigger Redirect
      try {
        const response = await fetch("/api/contact-submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            email: email,
            message: input
          })
        });

        if (response.ok) {
          console.log("Lead saved successfully.");
        }
      } catch (err) {
        console.error("Failed to save lead:", err);
      }

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            type: "bot",
            text: settings.chatbot_final_message || "Terima kasih! Informasi Anda sudah kami simpan. Silakan klik tombol di bawah untuk langsung terhubung dengan tim teknis kami di WhatsApp. Tim kami akan segera membantu Anda! 😊",
            time: timeStr
          }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleWhatsAppRedirect = () => {
    const waPhone = settings.contact_whatsapp
      ? settings.contact_whatsapp.replace(/[^0-9]/g, "")
      : "6281234567890";
    const waText = encodeURIComponent(
      `Halo Tim Master UPVC, saya *${name}*.\n\n*Saya ingin berkonsultasi mengenai custom produk / proyek UPVC:*\n${reason}\n\n*Kontak Saya:*\n- No. WA: ${phone}\n- Email: ${email}`
    );
    window.open(`https://wa.me/${waPhone}?text=${waText}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] bg-zinc-50 dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden flex flex-col mb-4 transition-all duration-300 animate-slide-up">
          
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/20">
                {botAvatar ? (
                  <img src={botAvatar} alt={botName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-white uppercase">{botName[0]}</span>
                )}
              </div>
              <div>
                <h4 className="font-bold text-sm">{botName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span className="text-[10px] text-emerald-100">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages Area (WA Doodle pattern style) */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{
              backgroundImage: `url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")`,
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(229, 231, 235, 0.4)" // Light grey Blend
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.type === "bot";
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isBot ? "justify-start animate-fade-in-left" : "justify-end animate-fade-in-right"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative ${
                    isBot 
                      ? "bg-white dark:bg-zinc-900 text-brand-charcoal dark:text-zinc-100 rounded-tl-none border border-zinc-200/30" 
                      : "bg-emerald-600 text-white rounded-tr-none"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className={`block text-[9px] text-right mt-1.5 ${isBot ? "text-zinc-400" : "text-emerald-200"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-900 text-brand-charcoal dark:text-zinc-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-zinc-200/30 flex items-center gap-1">
                  <span className="text-xs text-zinc-400 italic font-medium">{botName} sedang mengetik</span>
                  <span className="flex gap-1 items-center ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            {/* Final Call to Action Link */}
            {step === 5 && !isTyping && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-full text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  Hubungi Teknisi via WhatsApp
                </button>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer Input */}
          {step < 5 && (
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2">
              <input
                type={step === 2 ? "tel" : step === 3 ? "email" : "text"}
                placeholder={
                  step === 1 ? "Ketik nama Anda..." : 
                  step === 2 ? "Ketik nomor WA..." : 
                  step === 3 ? "Ketik alamat email..." : 
                  "Ceritakan kebutuhan Anda..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit"
                disabled={!userInput.trim()}
                className="w-9 h-9 rounded-full bg-emerald-600 disabled:bg-zinc-200 disabled:dark:bg-zinc-800 text-white flex items-center justify-center transition-colors hover:bg-emerald-700 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2.5 pr-5 rounded-full shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:shadow-emerald-500/10 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
        title="Tanya Nadia - Asisten UPVC"
      >
        <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce group-hover:animate-none">
          {isOpen ? (
            <X className="w-5.5 h-5.5" />
          ) : (
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.603 6.042L0 24l6.102-1.602a11.834 11.834 0 005.944 1.602h.005c6.634 0 12.048-5.414 12.048-12.05 0-3.219-1.253-6.241-3.53-8.513z" />
            </svg>
          )}
        </div>
        <div className="text-left">
          <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest leading-none mb-1">Butuh Bantuan?</p>
          <p className="text-xs font-black text-brand-charcoal dark:text-white leading-none">WhatsApp Kami</p>
        </div>
      </button>

    </div>
  );
}
