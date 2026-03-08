import '@testing-library/jest-dom';

// Polyfill for URL.canParse (not available in Node.js/Jest environment)
if (typeof URL.canParse === 'undefined') {
    URL.canParse = function (url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };
}
