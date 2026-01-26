import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveImage } from './saveImage.js';
import { SECRETS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3121;

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', (req, res) => {
    const deviceNames = SECRETS.DEVICES.map(d => d.NAME);
    res.json({
        status: 'ok',
        service: 'clairemont-camera-analzyer',
        devices: deviceNames,
        endpoints: {
            capture: '/capture/:deviceName',
            images: '/images/:deviceName/'
        }
    });
});

// Capture a snapshot from a device
app.get('/capture/:deviceName', async (req, res) => {
    const { deviceName } = req.params;

    try {
        console.log(`Capturing snapshot for device: ${deviceName}`);
        const imagePath = await saveImage(deviceName);

        if (imagePath) {
            const relativePath = path.relative(path.join(__dirname, 'images'), imagePath);
            res.json({
                success: true,
                device: deviceName,
                imagePath: `/images/${relativePath}`
            });
        } else {
            res.status(500).json({
                success: false,
                device: deviceName,
                error: 'Failed to capture snapshot'
            });
        }
    } catch (error) {
        console.error('Capture error:', error);
        res.status(500).json({
            success: false,
            device: deviceName,
            error: error.message
        });
    }
});

// Capture from default device
app.get('/capture', async (req, res) => {
    const defaultDevice = SECRETS.DEVICES[0]?.NAME || 'TATAMI';
    res.redirect(`/capture/${defaultDevice}`);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
