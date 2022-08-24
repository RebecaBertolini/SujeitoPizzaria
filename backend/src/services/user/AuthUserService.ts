import prismaClient from '../../prisma/index';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

interface AuthRequest {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        //verificar se email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if (!user) {
            throw new Error('Usuário não encontrado.')
        }

        //verifica se a senha informada esta correta
        //retorna true ou false
        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            throw new Error('Senha incorreta.')
        }

        //se deu tudo certo, gera o token para o usuario
        const token = sign(
            {
                //payload
                name: user.name,
                email: user.email
            },
            //senha em hash
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: '30d'
            }
        )

        return ({
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
        })
    }
}
export { AuthUserService }