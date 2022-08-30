import { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import styles from './styles.module.scss';
import { Header } from '../../components/Header';

import { canSSRAuth } from '../../utils/canSSRAuth';

import { FiUpload } from 'react-icons/Fi';

import { setupAPICliente } from '../../services/api';

import { toast } from 'react-toastify';


type ItemProps = {
    id: string,
    name: string
}

//tipagem para receber um array de ItemProps
interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Product( { categoryList }: CategoryProps ) {

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

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

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        try{

            const data = new FormData();

            if(name === '' || price === '' || description === '' || imageAvatar === null) {
                toast.error('Preencha todos os campos.')
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('file', imageAvatar)
            data.append('category_id', categories[categorySelected].id)

            const apiClient = setupAPICliente();

            await apiClient.post('/product', data);

            toast.success('Produto cadastrado com sucesso!')

        } catch(err){
            console.log(err);
            toast.error('Ops! Erro ao cadastrar.')
        }

        setName('');
        setDescription('');
        setPrice('');
        setImageAvatar(null);
        setAvatarURL('');
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

                    <form className={styles.form} onSubmit={handleRegister}>

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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type='text'
                            placeholder='Digite o preço do produto'
                            className={styles.input}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea
                            placeholder='Descrição do produto'
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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