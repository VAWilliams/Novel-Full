import puppeteer from 'puppeteer';
import { Novel } from "../models/novel.model";
import { NovelInfo } from '../models/novel-info.model';
import { ChapterLink } from '../models/chapter-link.model';
import novelInfoSelector from '../selectors/novel-info.selector';

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

    static async getNovelInfo(resourcePath: string): Promise<NovelInfo> {
        const browser = await puppeteer.launch({
            args: [
                '--disable-web-security',
            ], headless: true
        });
        const page = await browser.newPage();
        await page.goto(`${host}/${resourcePath}`);
        await page.waitForSelector(novelInfoSelector.infoHeading);

        const evaluateWhenDone = async <T>(selector: string, callback: (element: any) => T) => {
            const awaitedElement = await page.waitForSelector(selector);
            return await awaitedElement?.evaluate(callback) as T;
        }


        const title = await evaluateWhenDone(
            novelInfoSelector.title,
            (element: HTMLHeadingElement) => element.textContent ?? ''
        );

        const description = await evaluateWhenDone(
            novelInfoSelector.description,
            (element: HTMLDivElement) => Array
                .from(element.querySelectorAll('p'))
                .map(paragraphElement => paragraphElement.textContent ?? '')
        );

        const latestChapters = await evaluateWhenDone(
            novelInfoSelector.latestChapters,
            (element: HTMLUListElement) => Array
                .from(element.querySelectorAll('a'))
                .map(anchor => ({
                    name: anchor.querySelector('span')?.textContent?.trim(),
                    link: anchor.attributes.getNamedItem('href')?.value
                } as ChapterLink)
            )
        );

        const image = await evaluateWhenDone(
            novelInfoSelector.image,
            (element: HTMLImageElement) => element
                .attributes
                .getNamedItem('src')
                ?.value ?? ''
        );

        const authors = await evaluateWhenDone(
            novelInfoSelector.authors,
            (element: HTMLDivElement) => Array
                .from(element.querySelectorAll('a'))
                .map(anchor => anchor.textContent ?? '')
        );

        const alternativeNames = await evaluateWhenDone(
            novelInfoSelector.alternativeNames,
            (element: HTMLDivElement) => element
                .textContent
                ?.replace('Alternative names:', '')
                .trim()
                .split(', ') ?? []
        );

        const genres = await evaluateWhenDone(
            novelInfoSelector.genres,
            (element: HTMLDivElement) => Array
                .from(element.querySelectorAll('a'))
                .map(anchor => anchor.textContent ?? '')
        )

        const source = await evaluateWhenDone(
            novelInfoSelector.source,
            (element: HTMLDivElement) => element
                .textContent
                ?.replace('Source:', '')
                .trim() ?? ''
        );

        const status = await evaluateWhenDone(
            novelInfoSelector.status,
            (element: HTMLAnchorElement) => element
                .textContent ?? ''
        );

        await browser.close();

        return {
            title,
            description,
            latestChapters,
            image,
            authors,
            alternativeNames,
            genres,
            source,
            status
        };
    }

}