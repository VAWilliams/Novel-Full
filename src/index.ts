import express from 'express';
import { NovelScraper } from './scrapers/novel.scraper';
import { NovelInfoRequest } from './models/novel-info.model';
import { ChapterRequest } from './models/chapter.model';

const app = express();
const port = 3000;

app.get('/search', (request, response) => {
    const keyword = request.query.keyword ?? '';
    const hasKeyword = !!keyword && typeof keyword === 'string';

    if (!hasKeyword) return response
        .status(400)
        .json({
            message: 'Please adhere to the request format.',
            format: '/search?keyword=<keyword>'
        });

    NovelScraper.searchNovelByKeyword(keyword)
        .then(novels => response.status(200).json(novels))
        .catch(error => response.status(500).json({ error }));
})

app.get('/info/:resourcePath', (request: NovelInfoRequest, response) => {
    const resourcePath = request.params.resourcePath ?? '';
    const hasResourcePath = !!resourcePath && typeof resourcePath === 'string';

    if (!hasResourcePath) return response
        .status(400)
        .json({
            message: 'Please adhere to the request format.',
            format: '/info/<resourcePath>'
        });

    NovelScraper.getNovelInfo(resourcePath)
        .then(novelInfo => response.status(200).json(novelInfo))
        .catch(error => response.status(500).json({ error }));
})

app.get('/chapter/:novel/:chapter', (request: ChapterRequest, response) => {
    const novel = request.params.novel ?? '';
    const hasNovel = !!novel && typeof novel === 'string';

    const chapter = request.params.chapter ?? '';
    const hasChapter = !!chapter && typeof chapter === 'string';

    const hasParams = hasNovel && hasChapter;

    if (!hasParams) return response
        .status(400)
        .json({
            message: 'Please adhere to the request format.',
            format: '/chapter/<novel>/<chapter>'
        });

    NovelScraper.getChapter(novel, chapter)
        .then(chapter => response.status(200).json(chapter))
        .catch(error => response.status(500).json({ error }));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`)
})