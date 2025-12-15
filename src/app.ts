import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import customersRouter from "./routes/customers";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/customers", customersRouter);

// Basic 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

// Basic error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

export default app;

