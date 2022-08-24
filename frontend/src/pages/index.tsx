
import { useContext, FormEvent, useState } from 'react';
import Head from 'next/head';
import styles from '../../styles/home.module.scss';
import Image from 'next/image';

import logoImg from '../../public/logo.svg';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

import Link from 'next/link';
import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {

  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  async function handleLogin(event: FormEvent){
    //ao enviar, nao carregar a pagina
    event.preventDefault();

    if(email === '' || password === ''){
      toast.error('Campos inválidos.')
      return;
    }

    setLoading(true);

    let data = {
      email,
      password
    }
  
    await signIn(data)

    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>SujeitoPizza - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo sujeito pizzaria' />
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input 
            placeholder='Digite seu e-mail'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
            placeholder='Digite sua senha'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
              type='submit'
              loading={loading}
            >
              Acessar
            </Button>
          </form>

          <Link href="/signup">
          <a className={styles.text}>Não possui uma conta? Cadastre-se.</a>
          </Link>
          
        </div>
      </div>
    </>
  )
}

//funcao SSR para que usuarios logados nao acessem a pagina de login

export const GetServerSideProps = canSSRGuest( async (ctx) => {
  return {
    props: {}
  }
})