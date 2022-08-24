import {Request, response, Response } from 'express'
import { CreateUserService } from '../../services/user/CreateUserService'

//controller faz a chamada do serviço
class CreateUserController{
    async handle(req: Request, res: Response){
        const {name, email, password} = req.body;
        
        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name, 
            email,
            password 
        });
        return res.json( `Usuário ${user.name} cadastrado com sucesso!`)
    }
}

export { CreateUserController }