const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const MESSAGES = require("./lang/messages/en/user");
const ERROR = require("./enums/errorEnum");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  credentials: true,
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.post("/paraphrase", async (req, res) => {
  const prompt = req.body.action + ": " + req.body.text;
  const data = { inputs: prompt };
  const config = {
    headers: { Authorization: `Bearer ${process.env.GRAMMARLY_API_KEY}` },
  };
  
  try {
    const result = await fetchDataWithRetry("https://api-inference.huggingface.co/models/grammarly/coedit-large", data, config);
    res.status(ERROR.SUCCESS).send(result[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(ERROR.INTERNAL_SERVER_ERROR).send(MESSAGES.INTERNAL_SERVER_ERROR);
  }
});

async function fetchDataWithRetry(url, data, config, retries = 10, delay = 3000) {
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchDataWithRetry(url, data, config, retries - 1, delay);
    } else {
      throw error;
    }
  }
}

// Start server
app.listen(port, () => {
  console.log(`LLM Service is running on port ${port}`);
});
