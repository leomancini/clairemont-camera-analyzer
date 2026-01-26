import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { PATHS } from './config.js';
import { getAccessToken } from './getAccessToken.js';
import { getDeviceInfo } from './getDeviceInfo.js';
import { getStreamURL } from './getStreamURL.js';
import { captureWebRTC } from './captureWebRTC.js';

function formatDate(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

export async function saveImage(deviceName) {
    const accessToken = await getAccessToken();
    const deviceInfo = getDeviceInfo(deviceName);

    if (!deviceInfo) {
        console.error(`Device not found: ${deviceName}`);
        return null;
    }

    const outputPath = path.join(PATHS.IMAGES, deviceName, `${formatDate(new Date())}.jpg`);

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    if (deviceInfo.STREAM_TYPE === 'RTSP') {
        const streamURL = await getStreamURL(accessToken, deviceInfo);
        try {
            execSync(`ffmpeg -y -i "${streamURL}" -vframes 1 ${outputPath}`);
        } catch (error) {
            console.error(`RTSP capture failed for ${deviceName}:`, error.message);
            return null;
        }
    } else if (deviceInfo.STREAM_TYPE === 'WEBRTC') {
        const success = await captureWebRTC(accessToken, deviceInfo, outputPath);
        if (!success) {
            console.error(`WebRTC capture failed for ${deviceName}`);
            return null;
        }
    }

    return fs.existsSync(outputPath) ? outputPath : null;
}
