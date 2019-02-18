import fs from "fs";
import tar from "tar";
import puppeteer from "puppeteer";
import AWS from "AWS-sdk";

import {
    chromePath,
    DEBUG,
    executablePath,
    IS_LOCAL,
    launchOptionForLambda,
    remoteChromeS3Bucket,
    remoteChromeS3Key,
    setupChromePath
} from "htmlToScreenshot/src/puppeteer/helper/config";

const s3 = new AWS.S3();

let browser;
export const getBrowser = async () => {
    if (browser === undefined || !await isBrowserAvailable(browser)) {
        if (IS_LOCAL) {
            browser = await puppeteer.launch({
                headless: true,
                // slowMo: process.env.SLOWMO_MS,
                // dumpio: !!config.DEBUG,
                // use chrome installed by puppeteer
                executablePath: chromePath,
            });
        } else {
            await setupChrome();
            browser = await puppeteer.launch({
                headless: true,
                executablePath: executablePath,
                args: launchOptionForLambda,
                dumpio: !!exports.DEBUG,
            });
        }

        debugLog(async (b) => `launch done: ${await browser.version()}`);
    }

    return browser;
};

const isBrowserAvailable = async (browser) => {
    try {
        await browser.version();
    } catch (e) {
        debugLog(e);
        return false;
    }
    return true;
};

const setupChrome = async () => {
    if (!await existsExecutableChrome()) {
        if (await existsLocalChrome()) {
            debugLog('setup local chrome');
            await setupLocalChrome();
        } else {
            debugLog('setup s3 chrome');
            await setupS3Chrome();
        }
        debugLog('setup done');
    }
};

const existsLocalChrome = () => {
    return fs.existsSync(chromePath);
};

const existsExecutableChrome = () => {
    return fs.existsSync(executablePath);
};

const setupLocalChrome = () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(chromePath)
            .on('error', (err) => reject(err))
            .pipe(tar.x({ C: setupChromePath, }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve());
    });
};

const setupS3Chrome = () => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: remoteChromeS3Bucket,
            Key: remoteChromeS3Key,
        };
        s3.getObject(params)
            .createReadStream()
            .on('error', (err) => reject(err))
            .pipe(tar.x({ C: setupChromePath, }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve());
    });
};

const debugLog = (log) => {
    if (DEBUG) {
        let message = log;
        if (typeof log === 'function') message = log();
        Promise.resolve(message).then(
            (message) => console.log(message)
        );
    }
};
