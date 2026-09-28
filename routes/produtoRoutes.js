import express from 'express';
import path from 'path';
import __dirname from '../utils/pathUtils.js';
import { getDatabase } from '../config/database.js';

const router = express.Router();

router.get('/produto/cadastrar', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'cadastrar-produto.html');
    res.sendFile(filePath);
});

router.post('/produtos', async (req, res) => {
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
});

router.get('/produtos', async (req, res) => {
    try {
        const db = getDatabase();
        const produtos = await db.collection('produtos').find().toArray();

        res.render('ver-produto', { produtos });
    } catch (erro) {
        console.log('Erro ao buscar produtos:', erro);
        res.send('Erro ao buscar produtos');
    }
});

export default router;
