import { ChatOllama } from "@langchain/ollama";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const model = new ChatOllama({
  model: "llama3:8b",
});

export const sendMessage = async (message: string) => {
  const response = await model.invoke([
    new SystemMessage(
      "You are a helpful AI assistant. Be concise and clear in your responses."
    ),
    new HumanMessage(message),
  ]);

  return response.content;
};
