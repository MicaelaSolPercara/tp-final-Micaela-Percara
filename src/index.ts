import express, {Request, Response} from "express";
import path from 'path';


import healthRouter from "./routes/health.routes";
import authRouter from "./routes/auth.routes";
import tasksRouter from "./routes/tasks.routes";


const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});