import express from "express";
import connectDB from "./config/connectDB";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error-handler";
import catchErrors from "./utils/catchErrors";
import authRoutes from "./routes/auth-routes";
import { OK } from "./constants/http";
const PORT = process.env.PORT;
const ENV = process.env.NODE_ENV;
const APP_ORIGIN = process.env.APP_ORIGIN;

const app = express();
// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

// app.get("/api", async (req, res) => {
//   throw new Error("This is a test error");
//   res.status(200).json({ status: "healthy" });
// });
app.get(
  "/api",
  catchErrors(async (req, res) => {
    //throw new Error("This is a test error");
    res.status(OK).json({ status: "healthy" });
  }),
);
// AUTH ROUTES
app.use("/auth", authRoutes);

// ERROR HANDLER
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT} in ${ENV} environment.`);
    });
  } catch (err: any) {
    console.error(`Error with the server: ${err.message}`);
  }
};

startServer();
