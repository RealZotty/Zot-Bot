const playwright = require('playwright');
async function main(url) {
    const browser = await playwright.chromium.launch({
        headless: true// setting this to true will not run the UI
    });

    const page = await browser.newPage();
    await page.goto(url);
    const image =  await page.$eval('#content', elm => {
        const data = [];
        const listImg = elm.getElementsByClassName('cover-media');
        Array.from(listImg).forEach(x => {
            data.push(x.href)
        })
        return data
    })
    await page.waitForTimeout(5000)
    await browser.close();

    return image
}
exports.getImage = main;