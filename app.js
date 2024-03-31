const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { default: axiosRetry } = require('axios-retry');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/paraphrase", async (req, res) => {
  const prompt = req.query.action + ": " + req.query.text;
  const data = { inputs: prompt };
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/grammarly/coedit-large",
      data,
      {
        headers: { Authorization: `Bearer ${process.env.GRAMMARLY_API_KEY}` },
      }
    );
    const result = response.data;
    res.status(200).send(result[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing the request.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`LLM Service is running on port ${port}`);
});
