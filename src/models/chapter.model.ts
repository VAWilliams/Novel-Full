import { Request } from "express";

export interface ChapterNavigation {
    previous?: string,
    next?: string
}

export interface Chapter {
    novel: string,
    title: string,
    content: string[],
    links: ChapterNavigation
}

export type ChapterRequest = Request<{ novel?: string, chapter?: string }>;