const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");

    res.end(
      `
        <form action ="/message"  method= "POST">
        
        <input type='text' name="username"></input>
        <button type="submit"> send</button>
        </form>
        `
    );
  } else {
    if (req.url === "/message") {
      res.setHeader("Content-Type", "text/html");

      let dataChunks = [];
      req.on("data", (chunks) => {
        console.log(chunks);
        dataChunks.push(chunks);
      });
      req.on("end", () => {
        let combinedBuffer = Buffer.concat(dataChunks);
        console.log(combinedBuffer.toString());
        let values = combinedBuffer.toString().split("=")[1];
        console.log(values);

        fs.writeFile("message.txt", values, (err) => {
          res.statusCode = 302;
          res.setHeader("Location", "/");
          res.end();
        });
      });
    } else {
      if (req.url === "/read") {
        fs.readFile("message.txt", (err, data) => {
            res.setHeader('Content-Type', "text/html")
   if (err || !data || data.length === 0) {
     res.end(`<h1>No submissions yet</h1><a href="/">Go Back</a>`);
     return;
   }
          console.log(data);
          res.end(`
            <h1>Submitted Names</h1>
            <pre> ${data.toString()}</pre>
             <a href="/">Go Back</a> `);
        });
      }else{
        res.statusCode = 404
        res.setHeader("Content-Type", "text/plain")
        res.end("Page not found")
      }
    }
  }
});

server.listen(3000, () => {
  console.log("server is running");
});
