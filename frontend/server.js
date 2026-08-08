import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import backendApp from "../backend/app.js";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // Mount backend API Express app under /api
  app.use(backendApp);

  // Vite middleware for development preview
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JCB360 Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
