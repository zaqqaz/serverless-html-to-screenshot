import path from "path";

export const launchOptionForLambda = [
    // error when launch(); No usable sandbox! Update your kernel
    '--no-sandbox',
    // error when launch(); Failed to load libosmesa.so
    '--disable-gpu',
    // freeze when newPage()
    '--single-process',
];

export const IS_LOCAL = process.env.IS_LOCAL || process.env.NODE_ENV === "test";

export const chromePath = IS_LOCAL
    ? path.join(process.env.PWD, 'node_modules/puppeteer/.local-chromium/mac-609904/chrome-mac/Chromium.app/Contents/MacOS/Chromium')
    : path.join(process.env.PWD, 'headless_shell.tar.gz');

export const remoteChromeS3Bucket = process.env.CHROME_BUCKET || 'local-bucket';
export const remoteChromeS3Key = process.env.CHROME_KEY || 'headless_shell.tar.gz';

export const setupChromePath = path.join(process.env.PWD, path.sep, 'tmp');
export const executablePath = path.join(
    setupChromePath,
    'headless_shell'
);

export const DEBUG = process.env.DEBUG;
