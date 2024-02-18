import { ChapterLink } from "./chapter-link.model";

export interface NovelInfo {
    title: string;
    description: string[];
    latestChapters: ChapterLink[];
    image: string;
    authors: string[];
    alternativeNames: string[];
    genres: string[];
    source: string;
    status: string;
}