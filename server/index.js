require("dotenv").config();

const express = require("express");
const StreamChat = require("stream-chat").StreamChat;
const {startAiBotStreaming} = require("./ai");

const app = express();
const port = 3000;
app.use(express.raw({type: "application/json"})); // <-- parses all bodies as a Buffer

const apiKey =  process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_KEY;


const reqHandler = async (req, res) => {
    const client = StreamChat.getInstance(apiKey, STREAM_API_SECRET);


    // parse the request budy
    const rawBody = req.body;


    const body = JSON.parse(rawBody);
    if (!body) {
        return res.status(400).send("Invalid JSON");
    }

    const event = body;
    if (
        event.type !== "message.new" ||
        !event.message ||
        event.message.user.id === "chat-ai-assistant" ||
        !event.channel_type ||
        !event.channel_id
    ) {
        // we are interested only in new messages, from regular users
        return res.status(200).send("Not a new message");
    }

    // Think about what to do about it
    if (req.headers["x-webhook-attempt"] > 1) {
        return res.status(200).send("Not a new message");
    }

    const channel = client.channel(event.channel_type, event.channel_id);
    const prompt = event.message?.text;
    if (channel && prompt) {
        // start streaming in async mode
        await startAiBotStreaming(client, channel, prompt).catch(
            (error) => {
                console.error("An error occurred", error);
            },
        );
    }

    return res.status(200).send("OK");
};

const startServer = async () => {
    if (process.argv.length < 3) {
        console.error(
            "Please provide a name of generative API provider <'openai'",
        );
        process.exit(1);
    }


    app.post("/", reqHandler);

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}.`);
    });
};

startServer().then(r => console.log(`Server started`));
