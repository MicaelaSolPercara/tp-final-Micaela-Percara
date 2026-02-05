export {};
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

export const connectDB = async (): Promise<void> => {
  try {
    if (!MONGODB_URI || MONGODB_URI === "pendiente") {
      throw new Error("MONGODB_URI no está definido en el .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB conectado exitosamente");
  } catch (error: any) {
    console.error("❌ Error al conectar MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB desconectado");
});
