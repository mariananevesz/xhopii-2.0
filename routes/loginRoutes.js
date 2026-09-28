import express from 'express';
import { getDatabase } from '../config/database.js';
import { loginRateLimitMiddleware } from '../middlewares/middlewares.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { erro: null });
});

router.post('/login', loginRateLimitMiddleware, async (req, res) => {
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
});

export default router;
