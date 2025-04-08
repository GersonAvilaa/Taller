import getConnection from "../db/database.js"
const getUsuarios = async (req,res)=>{
try {
    const connection = await getConnection();
    const result = await connection.query("SELECT id, nombre_completo, cedula, correo_electronico, numero_telefono, direccion, contrasena From usuarios")
    res.json(result)
} catch (error) {
    console.error("ERROR 500");
}

}



export const methodHTTP = {
    getUsuarios 
}