import { useState, ChangeEvent } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';

import { canSSRAuth } from '../../utils/canSSRAuth';

import { FiUpload } from 'react-icons/Fi';

import { setupAPICliente } from '../../services/api';


type ItemProps = {
    id: string,
    name: string
}

//tipagem para receber um array de ItemProps
interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product( { categoryList }: CategoryProps ) {
    const [avatarURL, setAvatarURL] = useState('');
    const [imageAvatar, setImageAvatar] = useState(null);
    const [categories, setCategories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0);

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        
        if(!event.target.files){
            return;
        }

        const image = event.target.files[0]
        
        if(!image) {
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image)
            setAvatarURL(URL.createObjectURL(event.target.files[0]))
        }
    }

    //quando seleciona uma nova categoria na lista
    function handleChangeCategory(event){
        //console.log('Posição da categoria selecionada: ' + event.target.value)
        //console.log('Categoria selecionada: ' + categories[event.target.value])

        setCategorySelected(event.target.value)
    }

    return (
        <>
            <Head>
                <title>Novo produto - Sujeito Pizzaria</title>
            </Head>

            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Novo produto</h1>

                    <form className={styles.form}>

                        <label className={styles.labelAvatar}>
                            <span>
                                <FiUpload size={30} color='#FFF'/>
                            </span>

                            <input type="file" accept='image/png, image/jpeg' onChange={handleFile}/>
                            {/* se tiver uma imagem, exibe ela: */}
                            {avatarURL && (
                                 <img
                                 className={styles.preview}
                                 src={avatarURL}
                                 alt='Foto do produto'
                                 width={250}
                                 height={250}
 
                             />
                            )}
                        </label>

                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {categories.map( (item, index) => {
                                return (
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                )
                            })}
                        </select>

                        <input
                            type='text'
                            placeholder='Digite o nome do produto'
                            className={styles.input}
                        />

                        <input
                            type='text'
                            placeholder='Digite o preço do produto'
                            className={styles.input}
                        />

                        <textarea
                            placeholder='Descrição do produto'
                            className={styles.input}
                        />

                        <button className={styles.buttonAdd} type='submit'>Cadastrar</button>

                    </form>
                </main>

            </div>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    //buscar do lado do servidor a lista de categorias
    const apiClient = setupAPICliente(ctx);

    const response = await apiClient.get('/category');
    //cosole.log(response.data)

    //enviar a lista para o client side
    return {
        props: {
            categoryList: response.data
        }
    }
})