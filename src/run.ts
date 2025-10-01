import "dotenv/config";
import OpenAI from "openai";
import { getWeather } from "./weatherTool.ts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.MODEL || "gpt-4o-mini";

const tools: any[] = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Liefert Wetterinformationen für eine Stadt",
      parameters: {
        type: "object",
        properties: {
          city: { type: "string", description: "Name der Stadt, z. B. Berlin" }
        },
        required: ["city"]
      }
    }
  }
];

async function main() {
  const messages: any[] = [
    { role: "user", content: "Wie ist das Wetter in Frankfurt?" }
  ];

  const first = await client.chat.completions.create({
    model,
    messages,
    tools
  });

  const msg = first.choices[0].message!;
  const toolCall = msg.tool_calls?.[0];

  if (toolCall && toolCall.type === "function" && toolCall.function) {
    const args = JSON.parse(toolCall.function.arguments || "{}");
    const toolResult = await getWeather(args);

    messages.push(msg);
    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(toolResult)
    });

    const second = await client.chat.completions.create({
      model,
      messages
    });

    console.log("\n--- Antwort des Agents ---\n");
    console.log(second.choices[0].message!.content ?? "Keine Antwort");
  } else {
    console.log("\n--- Antwort des Agents ---\n");
    console.log(msg.content ?? "Keine Antwort");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});