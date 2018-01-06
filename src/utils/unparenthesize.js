export const unparenthesize = text =>
    text
        .trim()
        .replace(/^\(/, '')
        .replace(/\)$/, '');
