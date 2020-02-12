import * as config from './config.js';

export type Article = {
    author: string,
    content: string,
    description: string,
    publishedAt: string,
    title: string,
    url: string,
    source: {id: string, name: string}
}

export type Category = 'business' | 'entertainment' | 'general' | 'health' | 'science' | 'sports' | 'technology';

export default class News {
    static headlines(category: Category, onSuccess: (articles: Article[]) => void, onError?: (error: any) => void) {
        fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=100&apiKey=${config.config.newsAPIKey}`).then(response => response.json().then(json => onSuccess(json.articles)).catch(error => {if (onError) { onError(error) } }))
    }
}