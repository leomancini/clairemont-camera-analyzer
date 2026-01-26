import { SECRETS } from './config.js';

export function getDeviceInfo(deviceName) {
    for (const device of SECRETS.DEVICES) {
        if (device.NAME === deviceName) {
            return device;
        }
    }
    return null;
}
