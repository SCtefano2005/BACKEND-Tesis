// src/database/mongo.ts
import mongoose from "mongoose";
import { Db } from "mongodb";

const MONGO_URI =
  "mongodb+srv://marcelovillalva:qEt082gIsDC4rXht@cluster0.6qdqjw2.mongodb.net/Tesis?retryWrites=true&w=majority&appName=Cluster0";

export const connectToMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "Tesis",
    });
    console.log("✅ Conectado a MongoDB Atlas (BD: Tesis)");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

// ✅ Versión segura que nunca retorna undefined
export const getDb = (): Db => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("⚠️ La base de datos aún no está conectada.");
  }
  return db;
};
