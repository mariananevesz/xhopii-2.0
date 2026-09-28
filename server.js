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

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).render('login', {
            erro: 'Muitas tentativas de login. Tente novamente mais tarde.'
        });
    }
})


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'home.html');
    res.sendFile(filePath);
})

app.get('/login', (req, res) => {
    res.render('login', { erro: null });
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

app.get('/funcionarios', async (req, res) => {
    try {
        const db = getDatabase();

        const funcionarios = await db.collection('funcionarios').find().toArray();

        res.render('visualizar-funcionario', { funcionarios });
    } catch (erro) {
        console.log('Erro ao buscar funcionários:', erro);
        res.send('Erro ao buscar funcionários');
    }
})

app.get('/produtos', async (req, res) => {
    try {
        const db = getDatabase();

        const produtos = await db.collection('produtos').find().toArray();

        res.render('ver-produto', { produtos });
    } catch (erro) {
        console.log('Erro ao buscar produtos:', erro);
        res.send('Erro ao buscar produtos');
    }
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

        res.redirect('/clientes/cadastrar');
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

        res.redirect('/funcionario/cadastrar');
    } catch (erro) {
        console.log('Erro ao cadastrar funcionário:', erro);
        res.send('Erro ao cadastrar funcionário');
    }
})

app.post('/produtos', async (req, res) => {
    const {
        inputNomeProd,
        inputFabricanteProd,
        inputDescricaoProd,
        inputValorProd,
        inputQtdProd
    } = req.body;

    try {
        const db = getDatabase();

        await db.collection('produtos').insertOne({
            nome: inputNomeProd,
            fabricante: inputFabricanteProd,
            descricao: inputDescricaoProd,
            valor: inputValorProd,
            quantidade: inputQtdProd
        });

        res.redirect('/produto/cadastrar');
    } catch (erro) {
        console.log('Erro ao cadastrar produto:', erro);
        res.send('Erro ao cadastrar produto');
    }
})

app.post('/login', limiter, async (req, res) => {
    const { inputEmailLog, inputSenhaLog } = req.body;

    try {
        const db = getDatabase();
        const cliente = await db.collection('clientes').findOne({
            email: inputEmailLog,
            senha: inputSenhaLog
        });

        const funcionario = await db.collection('funcionarios').findOne({
            email: inputEmailLog,
            senha: inputSenhaLog
        });

        if (cliente || funcionario) {
            res.redirect('/');
        } else {
            res.render('login', {
                erro: 'E-mail ou senha inválidos!'
            });
        }

    } catch (erro) {
        console.log('Erro ao realizar login:', erro);
        res.render('login', {
            erro: 'Erro ao realizar login.'
        });
    }
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