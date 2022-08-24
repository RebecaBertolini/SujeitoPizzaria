import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';

import { router } from './routes'

const app = express();
app.use(express.json());
//Cors: para habilitar que qualquer IP/URL consiga fazer requisição na nossa API
app.use(cors());

app.use(router);

//cria rota estatica para acessar as imagens através do caminho e nome da foto
app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'temporario'))
)

app.use((err: Error, req: Request, res: Response, next: NextFunction)=>{
    //verificar se o que está passando na rota é um erro, para fazer o tratamento
    if(err instanceof Error){
            return res.status(400).json({
                error: err.message
            })
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    })
})

app.listen(3333, ()=> console.log('Servidor online!'))