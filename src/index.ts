import express from 'express';
import { NovelScraper } from './scrapers/novel.scraper';

const app = express();
const port = 3000;

app.get('/search', (request, response) => {
    const keyword = request.query.keyword ?? '';
    const hasKeyword = !!keyword && typeof keyword === 'string';

    if (!hasKeyword) return response
        .status(400)
        .json({
            message: 'Please provide keyword.'
        });

    NovelScraper.searchNovelByKeyword(keyword)
        .then(novels => response.status(200).json(novels))
        .catch(error => response.status(500).json({ error }));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`)
})