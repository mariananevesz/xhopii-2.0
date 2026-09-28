import express from 'express';
import path from 'path';
import __dirname from '../utils/pathUtils.js';

const router = express.Router();

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'home.html');
    res.sendFile(filePath);
});

router.get('/recuperar-senha', (req, res) => {
    const filePath = path.join(__dirname, 'views', 'recuperar-senha.html');
    res.sendFile(filePath);
});

export default router;
