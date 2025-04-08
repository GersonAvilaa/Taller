import express from "express";
import usuariosRoutes from "./routes/usuarios.routes.js"


const app = express();



app.set("port",5000);


/* routes */
app.use("/api/usuarios",usuariosRoutes);


export default app;