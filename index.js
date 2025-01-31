const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http"); // For creating the HTTP server
const app = express();

const server = http.createServer(app);

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware.js/errorHandler");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://mydevtinder.netlify.app",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mydevtinder.netlify.app"],
    methods: ["GET", "POST", "PUT", "PATCH"],
    credentials: true,
  })
);

//all Routes

app.use("/auth", require("./src/routes/authRoutes"));
// app.use("/profile", require("./src/routes/profileRoutes"));
// app.use("/request", require("./src/routes/connectionRoutes"));
// app.use("/user", require("./src/routes/userRotutes"));
// app.use("/message", require("./src/routes/messageRoute"));

//first connect to db then start listening to api calls
connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(5000, () => {
      console.log("server working at 5000");
    });
  })
  .catch((err) => {
    console.log("database connection error", err);
  });

//error handlewe middleware
app.use(errorHandler);

app.get("/", async (req, res) => {
  res.status(200).send("ok");
});
