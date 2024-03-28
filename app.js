const http = require("http");
const url = require("url");
const mysql = require("mysql");


class LLMService {
  constructor() {
    this.port = process.env.PORT || 3000;
  }

  start() {
    const server = http.createServer((req, res) => {
      const q = url.parse(req.url, true);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

      res.writeHead(200, { "Content-Type": "text/plain" });
      let message = "LLM Gateway serviceE\n";
      let version = "NodeJS " + process.versions.node + "\n";
      let response = [message, version].join("\n");
      res.end(response);
    });

    server.listen(this.port);
  }
}

const server = new LLMService();
server.start();
