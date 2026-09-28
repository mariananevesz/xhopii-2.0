import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import __dirname from './utils/pathUtils.js';

import {
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddlewware,
    rateLimitMiddleware,
    morganMiddleware
} from './middlewares/middlewares.js';

import { connectDatabase } from './config/database.js';

import homeRoutes from './routes/homeRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import funcionarioRoutes from './routes/funcionarioRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(staticMiddleware);
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddlewware);
app.use(morganMiddleware);

app.use('/', homeRoutes);
app.use('/', loginRoutes);
app.use('/', clienteRoutes);
app.use('/', funcionarioRoutes);
app.use('/', produtoRoutes);

connectDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor ativo rodando na porta ${port}`);
        });
    })
    .catch((erro) => {
        console.log('Erro ao conectar com MongoDB:', erro);
    });
