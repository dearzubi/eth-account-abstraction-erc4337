import _config from './config.json'
import _abi from './abi.json'
import path from 'path';
import fs from 'fs';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const config: {[key: string]: string | number | boolean | null} = _config;
const abi: {[key: string]: string | string[] | null} = _abi;

export const update = (key: string, value: string | number | boolean | null) => {

    config[key] = value;

    fs.writeFileSync(path.join(__dirname,'/config.json'), JSON.stringify(config, null, 2));

}

export const updateABI = (key: string, value: string | string[]) => {

    abi[key] = value;

    fs.writeFileSync(path.join(__dirname,`/abi.json`), JSON.stringify(abi, null, 2));

}

export default {
    get: (key: string): string | number | boolean | null => config[key],
    update: update,
    getABI: (key: string): string | string[] | null => abi[key],
    updateABI: updateABI
};