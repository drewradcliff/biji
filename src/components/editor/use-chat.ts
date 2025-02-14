"use client";

import { faker } from "@faker-js/faker";
import { useChat as useBaseChat } from "ai/react";

// import { useSettings } from "@/components/editor/settings";
import { db } from "@/db";
import { electronLlmRpc } from "@/rpc/llmRpc";
import { llmState } from "@/state/llmState";
import { useCallback } from "react";
import { useExternalState } from "@/hooks/useExternalState";

export const useChat = () => {
  // const { model } = useSettings();
  const { user } = db.useAuth();
  const { chatSession } = useExternalState(llmState);

  const openSelectModelFileDialog = useCallback(async () => {
    await electronLlmRpc.selectModelFileAndLoad();
  }, []);

  const sendPrompt = useCallback(
    (prompt: string) => {
      if (chatSession.generatingResult) return;

      void electronLlmRpc.prompt(prompt);
    },
    [chatSession.generatingResult]
  );

  console.log(chatSession.simplifiedChat);

  return useBaseChat({
    id: "editor",
    api: "http://localhost:3000/api/ai/command",
    body: {
      // model: model.value,
    },
    fetch: async (input, init) => {
      // console.log({ input });
      // console.log({ init });
      // if (!user) {
      // await new Promise((resolve) => setTimeout(resolve, 400));

      console.log("prompting");
      openSelectModelFileDialog();
      sendPrompt("hello world");

      const stream = fakeStreamText();
      return new Response(stream, {
        headers: {
          Connection: "keep-alive",
          "Content-Type": "text/plain",
        },
      });
      // return await fetch(input, init);
    },
  });
};

// Used for testing. Remove it after implementing useChat api.
const fakeStreamText = ({
  chunkCount = 10,
  streamProtocol = "data",
}: {
  chunkCount?: number;
  streamProtocol?: "data" | "text";
} = {}) => {
  // Create 3 blocks with different lengths
  const blocks = [
    Array.from({ length: chunkCount }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + " ",
    })),
    Array.from({ length: chunkCount + 2 }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + " ",
    })),
    Array.from({ length: chunkCount + 4 }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + " ",
    })),
  ];

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        // Stream the block content
        for (const chunk of block) {
          await new Promise((resolve) => setTimeout(resolve, chunk.delay));

          if (streamProtocol === "text") {
            controller.enqueue(encoder.encode(chunk.texts));
          } else {
            controller.enqueue(
              encoder.encode(`0:${JSON.stringify(chunk.texts)}\n`)
            );
          }
        }

        // Add double newline after each block except the last one
        if (i < blocks.length - 1) {
          if (streamProtocol === "text") {
            controller.enqueue(encoder.encode("\n\n"));
          } else {
            controller.enqueue(encoder.encode(`0:${JSON.stringify("\n\n")}\n`));
          }
        }
      }

      if (streamProtocol === "data") {
        controller.enqueue(
          `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":${blocks.reduce(
            (sum, block) => sum + block.length,
            0
          )}}}\n`
        );
      }

      controller.close();
    },
  });
};
