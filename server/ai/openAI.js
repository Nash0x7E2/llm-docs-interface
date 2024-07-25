const axios = require('axios');
require("dotenv").config();


async function* startStreaming(prompt) {
    const url = encodeURI(`http://localhost:8787/?text=${prompt}`)
    console.log(`Outgoing request to ${url}`);
    const response = await axios.get(url);
    for await (const chunk of response.data) {
        console.log('Received chunk:', chunk);
        yield chunk;
    }
}

module.exports = {
    startStreaming,
};
