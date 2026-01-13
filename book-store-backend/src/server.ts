console.log("🚀 server.ts loaded");

import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import prisma from "./lib/prisma";

const port = process.env.PORT || 8000;
const prefix = process.env.PREFIX || "/api/v1";
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  try {
    console.log("Starting server...");
    console.log("Database: PostgreSQL (Prisma)");

    // ✅ FORCE Prisma to connect on startup
    await prisma.$connect();
    console.log("✅ Prisma connected successfully");

    app.listen(port, () => {
      console.log(`✅ Server running on port ${port} (${NODE_ENV})`);
      console.log(`🔗 API prefix: ${prefix}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed");
    console.error(error);
    process.exit(1);
  }
};

startServer();
