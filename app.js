const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/paraphrase', async (req, res) => {
  const prompt = req.query.action + ": " + req.query.text;
  const data = { "inputs": prompt };
  const response = await fetch(
    "https://api-inference.huggingface.co/models/grammarly/coedit-large",
    {
      headers: { Authorization: `Bearer ${process.env.GRAMMARLY_API_KEY}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  res.status(200).send(result[0]);
});


// Start server
app.listen(port, () => {
  console.log(`LLM Service is running on port ${port}`);
});
