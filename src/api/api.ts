import { makeScreenshot } from "htmlToScreenshot/src/puppeteer/makeScreenshot";

export const handler = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const image = await makeScreenshot({
        html: requestBody.html,
        pageWidth: requestBody.pageWidth,
        pageHeight: requestBody.pageHeight,
        selector: requestBody.selector,
    });

    return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: { 'Content-Type': 'image/png', 'Content-Length': image.length },
        body: image,
    }
};
