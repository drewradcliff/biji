import { useState, FormEvent } from "react";
import { sendMessage } from "../services/chat";

export default function Prompt() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsLoading(true);
    try {
      const response = await sendMessage(prompt);
      // Handle the response - update your state accordingly
      setMessages((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: response },
      ]);
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.role}</strong>: {message.content}
        </div>
      ))}
    </form>
  );
}
