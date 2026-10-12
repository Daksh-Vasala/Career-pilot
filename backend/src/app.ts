import express from "express";
import morgan from "morgan";
import routes from "./routes/index.routes.ts";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./features/middlewares/error.middleware.ts";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:5000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorMiddleware);
export default app;
