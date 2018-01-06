import path from 'path';

import { fileExists } from './utils/fileExists';

export const findProjectRoot = (dir = process.env.PWD) =>
    new Promise(async (resolve, reject) => {
        const files = ['postcss.config.js', 'package.json'];
        for (let i = 0; i < files.length; i += 1) {
            const itExists = await fileExists(path.resolve(dir, files[i]));

            if (itExists) {
                resolve(dir);
                return;
            }
        }

        // TO-DO : Better message
        reject('The project root could not be found.');
    });
