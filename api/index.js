const express = require("express");
const app = express();
const ConnectDb = require("./Connection");
const errorHandler = require("./middleware/ErrorHandler");
const router = require("./routers/SignUp_router");
const cookieparser = require("cookie-parser");
const path = require("path");
const Router = require("./routers/listing_router");
let port = process.env.PORT;
ConnectDb();
app.use(express.json());
app.use(cookieparser());
app.use("/api/users", router);
app.use("/api/listing", Router);
app.use(errorHandler);

app.listen(port, () => {
  console.log("server is listening..." + port);
});
const _dirname = path.resolve();

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});
