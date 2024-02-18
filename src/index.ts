import express, { Request } from 'express';
import { NovelScraper } from './scrapers/novel.scraper';

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

app.get('/info/:resourcePath', (request: Request<{ resourcePath?: string }>, response) => {
    const resourcePath = request.params.resourcePath ?? '';
    const hasResourceParh = !!resourcePath && typeof resourcePath === 'string';

    if (!hasResourceParh) return response
        .status(400)
        .json({
            message: 'Please adhere to the request format.',
            format: '/info/<resourcePath>'
        });

    NovelScraper.getNovelInfo(resourcePath)
        .then(novelInfo => response.status(200).json(novelInfo))
        .catch(error => response.status(500).json({ error }));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`)
})