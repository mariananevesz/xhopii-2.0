import express from 'express'
import path from 'path'
import fs from 'fs'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

const pathAbsolute = new URL('.', import.meta.url).pathname;
const __dirname = pathAbsolute.slice(1);

const app = express()
const port = 3000

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

app.post('/clientes', (req, res) => {
    const { nome, sobrenome, cpf, dataNascimento, telefone, email, senha } = req.body;

    res.send(`<h1>Dados recebidos</h1>
        <p>Nome: ${nome}</p>
        <p>Sobrenome: ${sobrenome}</p>
        <p>CPF: ${cpf}</p>
        <p>Data de Nascimento: ${dataNascimento}</p>
        <p>Telefone: ${telefone}</p>
        <p>Email: ${email}</p>
        <p>Senha: ${senha}</p>`)
})

app.post('/funcionarios', (req, res) => {
    const {inputNomeFunc,inputSobrenomeFunc,inputCPFFunc,inputDataNascFunc,inputTelefoneFunc,inputCargoFunc,inputSalarioFunc,inputEmailFunc,inputSenha } = req.body;

    res.send(`<h1>Dados recebidos</h1>
        <p>Nome: ${inputNomeFunc}</p>
        <p>Sobrenome: ${inputSobrenomeFunc}</p>
        <p>CPF: ${inputCPFFunc}</p>
        <p>Data de Nascimento: ${inputDataNascFunc}</p>
        <p>Telefone: ${inputTelefoneFunc}</p>
        <p>Cargo: ${inputCargoFunc}</p>
        <p>Salário: ${inputSalarioFunc}</p>
        <p>Email: ${inputEmailFunc}</p>
        <p>Senha: ${inputSenha}</p>`)
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

app.listen(port, () => {
    console.log(`Servidor ativo rodando na porta ${port}`);
})