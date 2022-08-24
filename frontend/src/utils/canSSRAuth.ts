import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError'

//funcao para paginas que somente usuarios logados tem acesso
export function canSSRAuth<P>(fn: GetServerSideProps<P>){

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@sujeitopizza.token'];

        if(!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        //se tiver token segue, se der erro o token e destruido e volta para o login
        try{
            return await fn(ctx)
        } catch(err) {
            if(err instanceof AuthTokenError) {
                destroyCookie(ctx, '@sujeitopizza.token');

                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }

}