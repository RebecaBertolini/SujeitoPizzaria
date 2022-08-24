import crypto from 'crypto';
import multer from 'multer';

import {extname, resolve} from 'path';
//importou o multer, crypto para criptografar o nome das imagens (para nao ter conflito de nomes) e o path

export default {
    //deve receber a pasta a qual sera guardado o arquivo
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                //inicia do dirname, ou seja, o diretorio atual
                destination: resolve(__dirname, '..', '..', folder),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString('hex');
                    const fileName = `${fileHash} - ${file.originalname}`;

                    return callback(null, fileName)
                }
            })
        }
    }
}