import fs from 'fs';

export const fileExists = filepath =>
    new Promise(resolve => {
        fs.access(filepath, fs.constants.R_OK, err => {
            resolve(!err);
        });
    });

