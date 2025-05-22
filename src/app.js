import express from "express";
import cors from "cors";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes    from "./routes/cart.routes.js";
import comprasRoutes from "./routes/compras.routes.js";

const app = express();

app.set("port", 5000);
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/',(req,res)=>{
    res.send('REST API EN RENDER WITHOUT DATABASE ENDPOINTS')
})

/* routes */
app.use("/api/usuarios", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/compras", comprasRoutes);


export default app;
