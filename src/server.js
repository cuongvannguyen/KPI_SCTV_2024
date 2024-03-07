import express from "express";
import configViewEngine from "./configs/viewEngine";

// import initWebRoutes from "./routes/web";
// import initApiRoutes from "./routes/api";
import initApiHotelRoutes from "./routes/hotel";
import configCors from "./configs/cors";
import connectDB from "./configs/connectDB";
require("dotenv").config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

configViewEngine(app);
configCors(app);

//test JWT

//config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie-parser
app.use(cookieParser());

// app.use((req, res, next) => {
//   console.log(">>> check new request: host, path, method: ", req.hostname, req.path, req.method)
//   next()
// })

// initWebRoutes(app);
// initApiRoutes(app);
initApiHotelRoutes(app);

app.use((req, res) => {
  const path = req.path;
  console.log(`Đã gọi đường dẫn URL: ${path}`);
  return res.send("Opp! 404 not found");
});
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(">> Hotel JWT Backend is running on the port = ", PORT);
});
