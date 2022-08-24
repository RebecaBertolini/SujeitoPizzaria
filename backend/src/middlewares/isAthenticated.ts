import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload{
    sub: string,

}

export function isAuthenticated( req: Request, res: Response, next: NextFunction ) {
    //receber o token
    const authToken = req.headers.authorization;

    if(!authToken) {
        //status nao autorizado e finaliza
        return res.status(401).end()
    }

    //separa em dois itens do array, um o Bearer e o outro o token. A virgula ignora o primeiro item
    const [, token] = authToken.split( " " );

    //validar o token:
    try{
        //afirma que devolvera um tipo Payload. Retorna o sub, que e o ID do usuario.
        const { sub } = verify(token, process.env.JWT_SECRET) as Payload;
        
        //criar uma variavel dentro da Resquest com o id do usuario para ser recuperada durante o uso do app em sessoes autenticadas
        //precisou sobrescrever a tipagem da Request para que possuia o tipo user_id. Criou a tipagem em src/@types/express
        req.user_id = sub;

        return next();
    }catch(err){
        return res.status(401).end();
    }
}