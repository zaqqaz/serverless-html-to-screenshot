# serverless-html-to-screenshot

![lambda](https://user-images.githubusercontent.com/2823336/52962782-d6a16580-33a6-11e9-84c0-3c143fca2e54.png)

Lambda function which:
    👉 receive your html 
    👉 run the browser (puppeteer only for now) 
    👉 return the screenshot.
    
Api has only one route `/screenshot.png`

```$xslt
export interface TakeScreenshotProps {
    html: string;
    pageWidth?: number;
    pageHeight?: number;
    selector?: string;
    browser?: 'chrome'; --- more options are comming 
}
```

### Usage example

```$xslt
export function takeScreenshotFromAWS(props: TakeScreenshotProps) {
    return new Promise((resolve, reject) => {
        request.post(
            "${SCREENSHOT_API_URL}/screenshot.png",
            { json: { ...props, html: htmlForScreenshot(props.html) }, encoding: null },
            function (error: any, response: any, body: any) {
                if (!error && response.statusCode == 200) {
                    resolve(Buffer.from(body, 'base64'));
                }
            }
        );
    });
}
```

### Use cases:
 - for visual unit tests
 - and for any purposes where you need a screenshot from markup

### Pre requirements
 ```npm i -g serverless```
 
 Aws credentials in your bash_profile to deploy to AWS
 ```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
 ```
 
### Install 
```yarn install```

#### - To start local server: `yarn start`
#### - To deploy: `sls deploy`
