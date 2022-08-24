import { createContext, ReactNode, useState } from 'react';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';

import { toast } from 'react-toastify';

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}
export const AuthContext = createContext({} as AuthContextData)

//funcao para deslogar usuario
export function signOut(){
    try{
        destroyCookie(undefined, '@sujeitopizza.token')
        //envia para a tela de login
        Router.push('/')
    } catch {
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>();

    //!! - converte a variavel em boolean, ou seja, se nao existir sera falso
    const isAuthenticated = !!user;

    async function signIn({email, password}: SignInProps){
        try {
            const response = await api.post('/session', {
                email, 
                password
            }) 
            console.log(response.data)

            const {id, name, token } = response.data

            setCookie(undefined, '@sujeitopizza.token', token, {
                maxAge: 60 * 60 * 24 * 30,  //cookie expira em um mes
                path:'/' //quais caminhos terao acesso ao cookie, neste caso todos
            })

            setUser({
                id, 
                name, 
                email
            })

            //passar para as proximas requisicoes o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso!')

            //redirecionar o usuario para /dashboard
            Router.push('/dashboard')

        } catch(err) {
            toast.error('Erro ao acessar.')
            console.log('Erro ao acessar:', err)
        }
    }

    async function signUp({name, email, password}: SignUpProps){

        try{
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Cadastrado com sucesso');

            Router.push('/')

        } catch (err){
            toast.error('Erro ao cadastrar.')
            console.log('Erro ao cadastrar:', err)
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}