import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { initFileDb } from "./backend/services/fileDb.js";
import backendApp from "./backend/app.js";

dotenv.config();

const PORT = process.env.PORT || 3005;

async function startServer() {
  // Initialize Standalone Local JSON Database
  try {
    initFileDb();
  } catch (err) {
    console.error("[DB] Failed to initialize local FileDB at startup:", err);
  }

  const app = express();

  // Mount backend API Express app under /api
  app.use(backendApp);

  // Serve public static assets (including index-Dbowi09z.js bundle)
  app.use(express.static(path.join(process.cwd(), "public")));

  // Serve root index.html for single-page app routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JCB360 Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
