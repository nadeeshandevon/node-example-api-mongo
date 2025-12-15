import app from "./app";
import { PORT } from "./config";
import { connectDatabase } from "./config/database";

const start = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Customer API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();

