import app from "./app.js";
const main = () =>{
app.listen(app.get("port"));
console.log(`The company's server web is running on port ${app.get("port")}`);
}

main ();