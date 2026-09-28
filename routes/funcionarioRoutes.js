import express from 'express';
import path from 'path';
import __dirname from '../utils/pathUtils.js';
import { getDatabase } from '../config/database.js';

const router = express.Router();

router.get('/funcionario/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-funcionario.html');
    res.sendFile(filePath);
});

router.post('/funcionarios', async (req, res) => {
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
});

router.get('/funcionarios', async (req, res) => {
    try {
        const db = getDatabase();
        const funcionarios = await db.collection('funcionarios').find().toArray();

        res.render('visualizar-funcionario', { funcionarios });
    } catch (erro) {
        console.log('Erro ao buscar funcionários:', erro);
        res.send('Erro ao buscar funcionários');
    }
});

export default router;
