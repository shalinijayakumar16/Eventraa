import { useEffect, useMemo, useRef, useState } from "react";
import { sendChatbotMessage } from "../services/chatbotApi";

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

const createMessage = (role, text, extras = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  text,
  timestamp: new Date().toISOString(),
  ...extras,
});

function ChatbotWidget({ userId }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    createMessage(
      "bot",
      "Hi, I can help with events, registrations, attendance, and recommendations. Ask me anything about Eventra."
    ),
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const canSend = useMemo(() => Boolean(userId && input.trim() && !isTyping), [input, isTyping, userId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !userId || isTyping) return;

    setMessages((previous) => [...previous, createMessage("user", trimmed)]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendChatbotMessage({ userId, message: trimmed });
      setMessages((previous) => [
        ...previous,
        createMessage("bot", response?.reply || "Sorry, I didn’t understand.", {
          intent: response?.intent || "unknown",
          tag: response?.intent === "recommend_events" ? "Recommended for you ⭐" : "",
        }),
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        createMessage("bot", "Sorry, I couldn’t process that right now. Please try again."),
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderBubble = (message) => {
    const isUser = message.role === "user";
    const bubbleStyle = {
      maxWidth: "82%",
      padding: "12px 14px",
      borderRadius: isUser ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
      background: isUser ? "linear-gradient(135deg, #4F46E5, #7C3AED)" : "rgba(15,23,42,0.96)",
      border: isUser ? "1px solid rgba(129,140,248,0.35)" : "1px solid rgba(255,255,255,0.08)",
      color: "#E2E8F0",
      boxShadow: isUser ? "0 18px 34px rgba(79,70,229,0.22)" : "0 12px 24px rgba(0,0,0,0.22)",
      whiteSpace: "pre-wrap",
      lineHeight: 1.45,
      fontSize: 13,
    };

    return (
      <div
        key={message.id}
        style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          marginBottom: 10,
        }}
      >
        <div style={bubbleStyle}>
          {!isUser && message.tag ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(16,185,129,0.14)",
                border: "1px solid rgba(16,185,129,0.28)",
                color: "#6EE7B7",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {message.tag}
            </div>
          ) : null}
          <div>{message.text}</div>
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: isUser ? "rgba(255,255,255,0.72)" : "#64748B",
              textAlign: "right",
            }}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 22,
        bottom: 22,
        zIndex: 1300,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {open ? (
        <div
          style={{
            width: "min(92vw, 380px)",
            height: "min(72vh, 620px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 24,
            background: "linear-gradient(180deg, rgba(10,14,31,0.98), rgba(3,7,18,0.98))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 28px 70px rgba(0,0,0,0.45)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              background: "linear-gradient(135deg, rgba(79,70,229,0.95), rgba(15,118,110,0.9))",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>Eventra Assistant</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>Ask about events, attendance, and recommendations</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "none",
                background: "rgba(255,255,255,0.14)",
                color: "white",
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ×
            </button>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              background:
                "radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 36%), linear-gradient(180deg, rgba(2,6,23,0.78), rgba(2,6,23,0.92))",
            }}
          >
            {messages.map(renderBubble)}

            {isTyping ? (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }}>
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "18px 18px 18px 6px",
                    background: "rgba(15,23,42,0.96)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94A3B8",
                    fontSize: 13,
                  }}
                >
                  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                    <span className="typing-dot">•</span>
                    <span className="typing-dot">•</span>
                    <span className="typing-dot">•</span>
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div
            style={{
              padding: 14,
              background: "rgba(2,6,23,0.96)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                rows={2}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask about events, registration, attendance..."
                style={{
                  flex: 1,
                  resize: "none",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(15,23,42,0.92)",
                  color: "#E2E8F0",
                  padding: "12px 14px",
                  outline: "none",
                  fontSize: 13,
                  minHeight: 52,
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                style={{
                  borderRadius: 16,
                  border: "none",
                  padding: "12px 16px",
                  minHeight: 52,
                  minWidth: 64,
                  background: canSend ? "linear-gradient(135deg, #4F46E5, #14B8A6)" : "rgba(255,255,255,0.08)",
                  color: canSend ? "white" : "#64748B",
                  cursor: canSend ? "pointer" : "not-allowed",
                  fontWeight: 700,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            border: "none",
            cursor: "pointer",
            color: "white",
            fontSize: 26,
            fontWeight: 800,
            background: "linear-gradient(135deg, #4F46E5, #14B8A6)",
            boxShadow: "0 18px 38px rgba(79,70,229,0.4)",
          }}
        >
          💬
        </button>
      )}
    </div>
  );
}

export default ChatbotWidget;