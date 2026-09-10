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

app.listen(port, () => {
    console.log(`Servidor ativo rodando na porta ${port}`);
})