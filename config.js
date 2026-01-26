import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Set timezone for date formatting
process.env.TZ = 'America/New_York';

// Parse devices from env: "NAME1:ID1:TYPE1,NAME2:ID2:TYPE2"
function parseDevices(devicesStr) {
    if (!devicesStr) return [];
    return devicesStr.split(',').map(device => {
        const [NAME, ID, STREAM_TYPE] = device.split(':');
        return { NAME, ID, STREAM_TYPE };
    });
}

export const PATHS = {
    IMAGES: path.join(__dirname, 'images')
};

export const SECRETS = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN,
    PROJECT_ID: process.env.PROJECT_ID,
    DEVICES: parseDevices(process.env.DEVICES)
};
