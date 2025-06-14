import React, { useEffect, useRef, useState } from "react";
import { initializeChatSocket, joinRoom, sendMessage, onMessage, disconnectChatSocket } from "../../service/chatService";

interface ChatMessage {
  sender: string;
  text: string;
  timestamp?: string;
  receiver: string; // Opcional, si quieres mostrar el ID del receptor
}

interface ChatWindowProps {
  companyId: string;
  companyName: string;
  userId: string;
  senderId: string; // Opcional, si quieres mostrar el ID del remitente
  receiverId: string; // Opcional, si quieres mostrar el ID del receptor
}

const ChatWindow: React.FC<ChatWindowProps> = ({ companyId, companyName, userId, senderId, receiverId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Supón que guardas el token y el userId en localStorage tras el login
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      initializeChatSocket(token, userId);
    }
    const roomId = `${userId}_${companyId}`;
    joinRoom(roomId);

    // Escuchar mensajes entrantes
    const unsubscribe = onMessage((msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Scroll automático al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      unsubscribe();
      disconnectChatSocket();
    };
    // eslint-disable-next-line
  }, [companyId, userId]);

  const handleSend = () => {
    if (input.trim()) {
      const msg: ChatMessage = {
        sender: senderId,
        text: input,
        timestamp: new Date().toISOString(),
        receiver: receiverId || "", // Puedes dejarlo vacío si no es necesario
      };
      sendMessage(`${userId}_${companyId}`, msg);
      setMessages((prev) => [...prev, msg]);
      setInput("");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, maxWidth: 400, margin: "0 auto" }}>
      <h3>Chat con {companyName}</h3>
            <div style={{ height: 300, overflowY: "auto", background: "#f9f9f9", padding: 8, borderRadius: 6 }}>
        {messages.map((msg, idx) => {
  const isOwnMessage = msg.sender === senderId;
  return (
    <div
      key={idx}
      style={{
        margin: "8px 0",
        textAlign: isOwnMessage ? "right" : "left",
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: isOwnMessage ? "#2563eb" : "#e5e7eb",
          color: isOwnMessage ? "#fff" : "#333",
          borderRadius: 12,
          padding: "6px 12px",
          maxWidth: "70%",
          wordBreak: "break-word",
        }}
      >
        {msg.text}
      </span>
    </div>
  );
})}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", marginTop: 12 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          style={{ flex: 1, borderRadius: 8, border: "1px solid #ccc", padding: 8, marginRight: 8 }}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={handleSend} style={{ borderRadius: 8, background: "#2563eb", color: "#fff", border: "none", padding: "8px 16px" }}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;