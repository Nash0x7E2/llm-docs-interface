const axios = require('axios');
require("dotenv").config();


async function startStreaming(prompt) {
    const url = encodeURI(`http://localhost:8787/?text=${prompt}`)
    console.log(url);
    const response = await axios.get(url);
    return response.data;
}

module.exports = {
    startStreaming,
};
