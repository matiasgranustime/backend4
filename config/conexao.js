
import mongoose from "mongoose";

const url = "mongodb+srv://josejesuspl053_db_user:senhadomongo@granustime.6wa5pyg.mongodb.net/";

const conexao = await mongoose.connect(url);

console.log("MongoDB conectado com sucesso!");

export default conexao;
