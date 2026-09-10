import express from 'express'
import path from 'path'

const pathAbsolute = new URL('.', import.meta.url).pathname;
const __dirname = pathAbsolute.slice(1);

const app = express()
const port = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'assets')))

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

app.listen(port, () => {
    console.log(`Servidor ativo rodando na porta ${port}`);
})