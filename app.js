const http = require("http");
const routes = require("./route")
routes.testFunction()
const server =http.createServer(routes)



server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

