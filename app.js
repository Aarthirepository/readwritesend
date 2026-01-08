const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    // Read the submitted names first
    fs.readFile("message.txt", (err, data) => {
      res.setHeader("Content-Type", "text/html");

      let namesList = "";
      if (!err && data && data.length > 0) {
        namesList = `<h2>Submitted Names:</h2><pre>${data.toString()}</pre>`;
      } else {
        namesList = "<h2>No submissions yet</h2>";
      }

      // Send form + submitted names
      res.end(`
        <h1>Enter Name</h1>
        <form action="/message" method="POST">
          <input type="text" name="username" required>
          <button type="submit">Send</button>
        </form>
        ${namesList}
      `);
    });
  } else if (url === "/message" && method === "POST") {
    // Handle form submission
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      const parsed = Buffer.concat(body).toString();
      const username = decodeURIComponent(parsed.split("=")[1].replace(/\+/g, " "));

      // Append the new name to the file
      fs.appendFile("message.txt", username + "\n", err => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "text/plain");
          res.end("Error writing file");
          return;
        }
        // Redirect back to home page to show updated list
        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  } else {
    // 404 for any other route
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("Page not found");
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

