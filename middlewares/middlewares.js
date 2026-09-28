import express from 'express';
import __dirname from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

const staticMiddleware = express.static(path.join(__dirname, 'assets'));

const urlencodedMiddleware = express.urlencoded({ extended: true });
const jsonMiddleware = express.json();

const securityMiddleware = helmet();

const compressionMiddlewware = compression();

const rateLimitMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, tente novamente em 10 minutos.'
});

const loginRateLimitMiddleware = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    handler: (req, res) => {
        res.status(429).render('login', {
            erro: 'Muitas tentativas de login. Tente novamente mais tarde.'
        });
    }
});

const logFile = fs.createWriteStream(
    path.join(__dirname, 'acess.log'),
    { flags: 'a' }
);

const morganMiddleware = morgan('combined', { stream: logFile });

export {
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddlewware,
    rateLimitMiddleware,
    loginRateLimitMiddleware,
    morganMiddleware
};
