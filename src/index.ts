import "dotenv/config";
import express, {Request, Response} from "express";
import path from 'path';


import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import eventosRouter from "./routes/eventos.routes";




const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/eventos", eventosRouter);



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});