import express from 'express';
import path from 'path';
import __dirname from '../utils/pathUtils.js';
import { getDatabase } from '../config/database.js';

const router = express.Router();

router.get('/clientes/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-cliente.html');
    res.sendFile(filePath);
});

router.post('/clientes', async (req, res) => {
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
});

router.get('/clientes', async (req, res) => {
    try {
        const db = getDatabase();
        const clientes = await db.collection('clientes').find().toArray();

        res.render('visualizar-cliente', { clientes });
    } catch (erro) {
        console.log('Erro ao buscar clientes:', erro);
        res.send('Erro ao buscar clientes');
    }
});

export default router;
