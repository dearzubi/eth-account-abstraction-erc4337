import config from './config.json' assert { type: "json" };
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const update = (key, value) => {

    config[key] = value;

    fs.writeFileSync(path.join(__dirname,'/config.json'), JSON.stringify(config, null, 2));

}

export default {
    get: (key) => config[key],
    update: update
};