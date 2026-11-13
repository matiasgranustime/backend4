
import conexao from "../config/conexao.js";

const MarcaSchema = new conexao.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: String
});

const Marca = conexao.model("Marca", MarcaSchema);

export default Marca;
