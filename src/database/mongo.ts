// src/database/mongo.ts
import mongoose from "mongoose";
import { Db } from "mongodb";



const MONGO_URI = process.env.MONGO_URI;

export const connectToMongo = async (): Promise<void> => {
  try {
    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URI no está definida en las variables de entorno.");
    }

    await mongoose.connect(MONGO_URI, {
      dbName: "Tesis",
    });

    console.log("✅ Conectado a MongoDB Atlas (BD: Tesis)");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("⚠️ La base de datos aún no está conectada.");
  }
  return db;
};
