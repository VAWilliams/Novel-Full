import puppeteer from 'puppeteer';
import { Novel } from "../models/novel.model";

const host = 'https://novelfull.com';


export class NovelScraper {

    static async searchNovelByKeyword(keyword: string): Promise<Novel[]> {
        const browser = await puppeteer.launch({
            args: [
                '--disable-web-security',
            ], headless: true
        });
        const page = await browser.newPage();
        await page.goto(`${host}/search?keyword=${keyword}`);
        const resultSelector = '#list-page > div.col-xs-12.col-sm-12.col-md-9.col-truyen-main.archive > div';
        const results = await page.waitForSelector(resultSelector);

        if (!results) return [];

        const novels = await results.evaluate(result => {
            const rows = Array.from(result.querySelectorAll('.row'));
            return rows.map(row => ({
                image: row.querySelector('img')?.attributes.getNamedItem('src')?.value,
                link: row.querySelector('.truyen-title a')?.attributes.getNamedItem('href')?.value,
                title: row.querySelector('.truyen-title a')?.textContent ?? undefined,
                author: row.querySelector('.author')?.textContent?.trim()
            } as Novel));
        });

        await browser.close();

        return novels;
    };

}