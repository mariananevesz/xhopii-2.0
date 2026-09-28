import express from 'express'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv';
import { connectDatabase, getDatabase } from './config/database.js';

dotenv.config();

const pathAbsolute = new URL('.', import.meta.url).pathname;
const __dirname = pathAbsolute.slice(1);

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'assets')))

const logFile = fs.createWriteStream(path.join(__dirname, 'acess.log'),{flags:'a'})
app.use(morgan('combined', {stream: logFile}))
app.use(helmet())

app.use(compression());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: "SAI FORA!"
})


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'home.html');
    res.sendFile(filePath);
})

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'login.html');
    res.sendFile(filePath);
})

app.get('/clientes/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-cliente.html');
    res.sendFile(filePath);
})

app.get('/funcionario/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-funcionario.html');
    res.sendFile(filePath);
})

app.get('/produto/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-produto.html');
    res.sendFile(filePath);
})

app.get('/recuperar-senha', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'recuperar-senha.html');
    res.sendFile(filePath);
})

app.get('/funcionarios', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'visualizar-funcionario.html');
    res.sendFile(filePath);
})

app.get('/produtos', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'ver-produto.html');
    res.sendFile(filePath);
})

app.post('/clientes', async (req, res) => {
    const { nome, sobrenome, cpf, dataNascimento, telefone, email, senha } = req.body;

    try {
        const db = getDatabase();

        await db.collection('clientes').insertOne({
            nome,
            sobrenome,
            cpf,
            dataNascimento,
            telefone,
            email,
            senha
        });

        res.send('Cliente cadastrado com sucesso!');
    } catch (erro) {
        console.log('Erro ao cadastrar cliente:', erro);
        res.send('Erro ao cadastrar cliente');
    }
})

app.post('/funcionarios', async (req, res) => {
    const {
        inputNomeFunc,
        inputSobrenomeFunc,
        inputCPFFunc,
        inputDataNascFunc,
        inputTelefoneFunc,
        inputCargoFunc,
        inputSalarioFunc,
        inputEmailFunc,
        inputSenha
    } = req.body;

    try {
        const db = getDatabase();

        await db.collection('funcionarios').insertOne({
            nome: inputNomeFunc,
            sobrenome: inputSobrenomeFunc,
            cpf: inputCPFFunc,
            dataNascimento: inputDataNascFunc,
            telefone: inputTelefoneFunc,
            cargo: inputCargoFunc,
            salario: inputSalarioFunc,
            email: inputEmailFunc,
            senha: inputSenha
        });

        res.send('Funcionário cadastrado com sucesso!');
    } catch (erro) {
        console.log('Erro ao cadastrar funcionário:', erro);
        res.send('Erro ao cadastrar funcionário');
    }
})

app.post('/produtos', (req, res) => {
    const {inputNomeProd,inputFabricanteProd,inputDescricaoProd,inputValorProd,inputQtdProd } = req.body;

    res.send(`<h1>Dados recebidos</h1>
        <p>Nome: ${inputNomeProd}</p>
        <p>Fabricante: ${inputFabricanteProd}</p>
        <p>Descrição: ${inputDescricaoProd}</p>
        <p>Valor: ${inputValorProd}</p>
        <p>Quantidade: ${inputQtdProd}</p>`)
})

app.post('/login', limiter, (req, res) => {
    const { inputEmailLog, inputSenhaLog } = req.body;
    const filePath = path.join(__dirname, 'usuarios.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.send('Erro ao ler arquivo de usuários');
            return;
        }
        const usuarios = JSON.parse(data);
        const usuarioEncontrado = usuarios.find(usuario =>
            usuario.usuario === inputEmailLog &&
            usuario.senha === inputSenhaLog
        );
        if (usuarioEncontrado) {
            res.redirect('/');
        } else {
            res.send('Usuário não encontrado');
        }
    });
})

app.get('/clientes', async (req, res) => {
    try {
        const db = getDatabase();

        const clientes = await db.collection('clientes').find().toArray();

        res.render('visualizar-cliente', { clientes });
    } catch (erro) {
        console.log('Erro ao buscar clientes:', erro);
        res.send('Erro ao buscar clientes');
    }
})

connectDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor ativo rodando na porta ${port}`);
        })
    })
    .catch((erro) => {
        console.log('Erro ao conectar com MongoDB:', erro);
    });