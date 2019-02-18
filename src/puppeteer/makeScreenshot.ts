import { getBrowser } from "htmlToScreenshot/src/puppeteer/helper/setup";

export interface MakeScreenshotProps {
    html: string;
    pageWidth?: number;
    pageHeight?: number;
    selector?: string;
}

export async function makeScreenshot(props: MakeScreenshotProps) {
    const {
        pageWidth = 800,
        pageHeight = 600,
        selector = "body",
        html,
    } = props;
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: pageWidth, height: pageHeight });
    await page.setContent(html);
    const elementHandle = await page.$(selector);

    if (elementHandle) {
        const screenShot = await elementHandle.screenshot();
        await page.close();

        return screenShot;
    }

    await page.close();
}
