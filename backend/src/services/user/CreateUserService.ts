import { Prisma } from '@prisma/client';
import primaClient from '../../prisma/index';
import { hash } from 'bcryptjs'

interface userRequest{
    name: string;
    email: string;
    password: string;
}

class CreateUserService{
    async execute({name, email, password}: userRequest){
        //verificar se enviou o e-mail
        if (!email) {
            throw new Error("E-mail incorreto.")
        }
        //verificar se o e-mail já esta cadastrado:
        //se houver o email cadastrado na tabela do BD, ele é armazenado nessa variavel
        const userAlreadyExists = await primaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(userAlreadyExists){
            throw new Error("Usuário já cadastrado.")
        }

        const passwordHash = await hash(password, 8)

        //cadastrar o usuario
        const user = await primaClient.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash,
            },
            //select: seleciona somente o que será devolvido da requisicao, para nao devolver a senha
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return user 
    }
}
export { CreateUserService }