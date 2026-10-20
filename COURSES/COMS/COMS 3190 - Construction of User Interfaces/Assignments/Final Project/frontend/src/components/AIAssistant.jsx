import { useState } from "react";
import { errorFromResponse, logClientError } from "../utils/errorLogger.js";

function AIAssistant({ accessToken, apiBase }) {
  //little floating ai chat thing only shows after login
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I can answer basic health and hospital app questions. I cannot diagnose or handle emergencies.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();

    const message = draft.trim();

    if (!message) {
      return;
    }

    const nextMessages = [...messages, { role: "user", text: message }];
    //show the user message right away before waiting on gemini
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const response = await fetch(`${apiBase}/api/assistant/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          message,
          history: nextMessages.slice(-6).map((item) => ({
            role: item.role,
            text: item.text,
          })),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw errorFromResponse(response, data, "AI assistant failed.");
      }

      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error.message || "The AI assistant is unavailable right now." },
      ]);
      logClientError(apiBase, error, { area: "ai-assistant" });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="ai-assistant">
      {isOpen && (
        <div className="ai-panel" role="dialog" aria-label="AI health assistant">
          <div className="ai-header">
            <div>
              <strong>Health Assistant</strong>
              <span>General guidance only</span>
            </div>
            <button onClick={() => setIsOpen(false)} type="button">
              Close
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div className={`ai-message ${message.role}`} key={`${message.role}-${index}`}>
                {message.text}
              </div>
            ))}
            {isSending && <div className="ai-message assistant">Thinking...</div>}
          </div>

          <form className="ai-form" onSubmit={sendMessage}>
            <input
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a basic health question"
              value={draft}
            />
            <button disabled={isSending} type="submit">
              Send
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="ai-toggle" onClick={() => setIsOpen(true)} type="button">
          AI
        </button>
      )}
    </section>
  );
}

export default AIAssistant;
