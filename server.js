import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import compression from "compression";
import { initFileDb, saveDbSync } from "./backend/services/fileDb.js";
import backendApp from "./backend/app.js";

dotenv.config();

const PORT = process.env.PORT || 3005;

async function startServer() {
  // Initialize Standalone Local JSON Database with in-memory indexing
  try {
    initFileDb();
  } catch (err) {
    console.error("[DB] Failed to initialize local FileDB at startup:", err);
  }

  const app = express();

  // Disable framework identifier
  app.disable("x-powered-by");

  // HTTP Payload Compression (Gzip / Deflate for static assets & HTML)
  app.use(compression());

  // Mount backend API Express app under /api
  app.use(backendApp);

  // Serve public static assets with aggressive HTTP caching for immutable assets
  app.use(express.static(path.join(process.cwd(), "public"), {
    maxAge: "1d",
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      // Long-term caching for hashed bundle assets
      if (filePath.includes("/assets/")) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    }
  }));

  // Serve root index.html with no-cache so clients always get latest script versions
  app.get("*", (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile(path.join(process.cwd(), "index.html"));
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[JCB360] Production Enterprise Server running on http://localhost:${PORT}`);
  });

  // Graceful Shutdown to eliminate memory leaks and ensure data flush
  const shutdown = (signal) => {
    console.log(`[JCB360] Received ${signal}. Commencing graceful shutdown...`);
    try {
      saveDbSync();
      console.log("[JCB360] Database state cleanly synchronized.");
    } catch (e) {
      console.error("[JCB360] Error flushing database on exit:", e);
    }

    server.close(() => {
      console.log("[JCB360] Closed HTTP connections. Process exiting.");
      process.exit(0);
    });

    // Force exit if hanging sockets don't close within 5 seconds
    setTimeout(() => {
      console.error("[JCB360] Forcing exit after shutdown timeout.");
      process.exit(1);
    }, 5000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Crash-free global error safety nets
  process.on("uncaughtException", (err) => {
    console.error("[CRITICAL] Uncaught Exception caught by enterprise handler:", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("[CRITICAL] Unhandled Rejection caught at:", promise, "reason:", reason);
  });
}

startServer();
