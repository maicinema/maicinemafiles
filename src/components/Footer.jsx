import { useState } from "react";

function Support() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello, welcome to MaiCinema Support. How can we help you today?"
    }
  ]);
  const [input, setInput] = useState("");

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleQuickReply = (type) => {
    if (type === "payment") {
      addUserMessage("I need help with payment.");
      addBotMessage(
  "Please hold on while we transfer you to a customer service representative for payment assistance. Kindly keep your payment proof ready as there are other people currently in the queue."
);
      return;
    }

    if (type === "tickets") {
      addUserMessage("I need help with tickets.");
      addBotMessage(
  "Please hold on while we transfer you to a customer service representative for ticket assistance. Kindly have your event name and ticket type ready while you wait in the queue."
);
      return;
    }

    if (type === "account") {
      addUserMessage("I need help with my account.");
      addBotMessage(
  "Please hold on while we transfer you to a customer service representative for account assistance. Kindly have the email linked to your account ready as there are other users in the queue."
);
      return;
    }

    if (type === "film") {
      addUserMessage("I want help with film submission.");
      addBotMessage(
  "Please hold on while we transfer you to a customer service representative for film submission assistance. Kindly prepare your film title, runtime, and issue details while you wait in the queue."
);
      return;
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    addUserMessage(trimmed);
    setInput("");

    const lower = trimmed.toLowerCase();

    if (lower.includes("payment")) {
      addBotMessage(
        "For payment issues, please keep your payment receipt or proof of transfer. Our confirmation process is being finalized."
      );
    } else if (lower.includes("ticket")) {
      addBotMessage(
        "Please send your event name and ticket type. If you already made payment, include the details so support can assist you faster."
      );
    } else if (lower.includes("account") || lower.includes("login")) {
      addBotMessage(
        "Please send the email address linked to your account and explain the problem clearly."
      );
    } else if (lower.includes("film") || lower.includes("submit")) {
      addBotMessage(
        "Please send your film title, runtime, and the issue you are facing with submission or onboarding."
      );
    } else {
  addBotMessage(
    "Please hold on while we transfer you to a customer service representative. There are other people in the queue at the moment, but someone will attend to you shortly."
  );
}
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <h1 style={styles.heading}>Customer Support</h1>
        <p style={styles.subtext}>
          Chat with our automated support assistant or leave your message for the team.
        </p>

        <div style={styles.quickActions}>
          <button style={styles.quickBtn} onClick={() => handleQuickReply("payment")}>
            Payment Help
          </button>
          <button style={styles.quickBtn} onClick={() => handleQuickReply("tickets")}>
            Ticket Help
          </button>
          <button style={styles.quickBtn} onClick={() => handleQuickReply("account")}>
            Account Help
          </button>
          <button style={styles.quickBtn} onClick={() => handleQuickReply("film")}>
            Film Submission
          </button>
        </div>

        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageRow,
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start"
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  background: msg.sender === "user" ? "#e50914" : "#1b1b1b",
                  color: "#fff"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.inputArea}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            style={styles.textarea}
          />
          <button style={styles.sendBtn} onClick={handleSend}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px 20px"
  },
  wrapper: {
    maxWidth: "850px",
    margin: "0 auto"
  },
  heading: {
    fontSize: "clamp(28px, 5vw, 42px)",
    marginBottom: "10px",
    textAlign: "center"
  },
  subtext: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: "30px"
  },
  quickActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "24px"
  },
  quickBtn: {
    background: "#111",
    color: "#fff",
    border: "1px solid #333",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  chatBox: {
    background: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "20px",
    minHeight: "320px",
    marginBottom: "20px"
  },
  messageRow: {
    display: "flex",
    marginBottom: "14px"
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 14px",
    borderRadius: "12px",
    lineHeight: 1.5
  },
  inputArea: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    resize: "vertical"
  },
  sendBtn: {
    background: "#e50914",
    color: "#fff",
    border: "none",
    padding: "14px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Support;