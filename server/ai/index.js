const {startStreaming: startOpenAIStreaming} = require("./openAI");
const {startStreaming: startMockStreaming} = require("./mockAI");

async function startAiBotStreaming(client, channel, prompt) {
    console.log("prompt$ " + prompt);


    const chunks = await startOpenAIStreaming(prompt);

    console.log(chunks);
    const message = await channel.sendMessage({
        user_id: "chat-ai-assistant",
        type: "regular",
        // 1.1 flag to indicate the ui to render a streamed message
        text: chunks,
    });

    // for await (const chunk of chunks) {
    //   await channel.sendEvent({
    //     // @ts-expect-error - non-standard event, StreamedMessage subscribes to it
    //     type: "gpt_chunk",
    //     user_id: "chat-ai-assistant",
    //     message_id: message.message.id,
    //     chunk,
    //   });
    //   text += chunk;
    // }

    await client.updateMessage(
        {
            id: message.message.id,
            isGptStreamed: false,
            chunks,
        },
        "chat-ai-assistant",
    );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    startAiBotStreaming,
};
