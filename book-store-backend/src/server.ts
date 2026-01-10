console.log("🚀 server.ts loaded");

import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import app from "./app";
import prisma from "./lib/prisma";

const port = process.env.PORT || 8000;
const prefix = process.env.PREFIX || "/api/v1";
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    console.log("Starting server...");
    console.log("Database: PostgreSQL (Prisma)");

    // ✅ Test Prisma connection
    await prisma.user.findMany();
    console.log("✅ Prisma query successful");

    app.listen(port, () => {
      console.log(`✅ Server running on port ${port} (${NODE_ENV})`);
      console.log(`🔗 API prefix: ${prefix}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

startServer();
