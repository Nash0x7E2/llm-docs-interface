const {startStreaming: startOpenAIStreaming} = require("./openAI");
const {startStreaming: startMockStreaming} = require("./mockAI");

async function startAiBotStreaming(client, channel, prompt, provider) {
    const message = await channel.sendMessage({
        user_id: "chat-ai-assistant",
        type: "regular",
        isGptStreamed: true,
    });


    await sleep(300);
    let text = "";

    const chunks = startMockStreaming();  //startOpenAIStreaming(prompt);

    for await (const chunk of chunks) {
        await channel.sendEvent({
            // @ts-expect-error - non-standard event, StreamedMessage subscribes to it
            type: "gpt_chunk",
            user_id: "chat-ai-assistant",
            message_id: message.message.id,
            chunk,
        });
        text += chunk;
    }

    await client.updateMessage(
        {
            id: message.message.id,
            isGptStreamed: false,
            text,
        },
        "chat-ai-assistant",
    );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    startAiBotStreaming,
};
