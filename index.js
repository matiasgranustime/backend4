
import express from 'express';
import Marca from './models/Marca.js';
import Instrumento from './models/Instrumento.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configurações do Express
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

// Liberar acesso à pasta public
app.use(express.static(__dirname + '/public'));

// ==================================
// PÁGINA INICIAL
// ==================================

app.get('/', (req, res) => {
    res.render('index');
});

// ==================================
// LISTAR INSTRUMENTOS
// ==================================

app.get('/instrumento/lst', async (req, res) => {
    try {
        const instrumentos = await Instrumento.find();

        res.render('instrumento/lst', { instrumentos });

    } catch (erro) {
        res.status(500).send('Erro ao listar instrumentos: ' + erro.message);
    }
});

// ==================================
// ABRIR FORMULÁRIO DE CADASTRO
// ==================================

app.get('/instrumento/add', (req, res) => {
    res.render('instrumento/add');
});

// ==================================
// ADICIONAR INSTRUMENTO
// ==================================

app.post('/instrumento/add/ok', async (req, res) => {
    try {
        const { nome, fabricante, preco, tipo } = req.body;

        await Instrumento.create({
            nome,
            fabricante,
            preco,
            tipo
        });

        res.render('instrumento/addok', { nome });

    } catch (erro) {
        res.status(500).send('Erro ao cadastrar instrumento: ' + erro.message);
    }
});

// ==================================
// ABRIR PÁGINA DE PESQUISA
// ==================================

app.get('/instrumento/buscar', (req, res) => {
    res.render('instrumento/buscar', {
        instrumentos: [],
        pesquisa: ''
    });
});

// ==================================
// REALIZAR PESQUISA PELO NOME
// ==================================

app.get('/instrumento/buscar/resultado', async (req, res) => {
    try {
        const pesquisa = req.query.nome;

        const instrumentos = await Instrumento.find({
            nome: { $regex: pesquisa, $options: 'i' }
        });

        res.render('instrumento/buscar', {
            instrumentos,
            pesquisa
        });

    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao pesquisar instrumentos: ' + erro.message);
    }
});

// ==================================
// EXCLUIR INSTRUMENTO
// ==================================


app.post('/instrumento/excluir/:id', async (req, res) => {
    console.log('ROTA DE EXCLUSÃO ACESSADA!');
    console.log('ID recebido:', req.params.id);

    try {
        await Instrumento.findByIdAndDelete(req.params.id);

        console.log('Instrumento excluído com sucesso!');

        res.redirect('/instrumento/lst');

    } catch (erro) {
        console.log('ERRO:', erro.message);

        res.status(500).send('Erro ao excluir: ' + erro.message);
    }
});


// ==================================
// ABRIR FORMULÁRIO DE EDIÇÃO
// ==================================

app.get('/instrumento/editar/:id', async (req, res) => {
    try {
        const instrumento = await Instrumento.findById(req.params.id);

        if (!instrumento) {
            return res.status(404).send('Instrumento não encontrado!');
        }

        res.render('instrumento/editar', { instrumento });

    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao buscar instrumento: ' + erro.message);
    }
});

// ==================================
// ATUALIZAR INSTRUMENTO
// ==================================

app.post('/instrumento/editar/ok/:id', async (req, res) => {
    try {
        const { nome, fabricante, preco, tipo } = req.body;

        await Instrumento.findByIdAndUpdate(req.params.id, {
            nome,
            fabricante,
            preco,
            tipo
        });

        res.redirect('/instrumento/lst');

    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao atualizar instrumento: ' + erro.message);
    }
});



// ==================================
// INICIAR SERVIDOR
// ==================================

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
