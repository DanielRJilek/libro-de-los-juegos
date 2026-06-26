import cabequinal from './cabequinal';

const CONFIGS = {
    cabequinal,
};

export function getGameConfig(title) {
    const key = title.toLowerCase().replace(/-/g, '');
    return CONFIGS[key];
}