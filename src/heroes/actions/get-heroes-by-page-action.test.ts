import { beforeEach, describe, expect, test } from "vitest";
import { getHeroesByPageAction } from "./get-heroes-by-page-action";
import AxiosMockAdapter from "axios-mock-adapter";
import { heroApi } from "../api/hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('getHeroesByPageAction', () => {
    const heroesApiMoock = new AxiosMockAdapter(heroApi);

    beforeEach(() => {
        heroesApiMoock.reset();
    })

    test('should return default heroes', async () => {

        heroesApiMoock.onGet('/').reply(200, {
            total: 10,
            pages: 2,
            heroes: [{
                image: '1.jpeg',
            }, {
                image: '2.jpeg',
            }]
        })

        const response = await getHeroesByPageAction(1);

        expect(response).toStrictEqual({
            total: 10,
            pages: 2,
            heroes: [
                { image: `${BASE_URL}/images/1.jpeg` },
                { image: `${BASE_URL}/images/2.jpeg` }
            ]
        });
    });

    test('should return the correct heroes when page is not a number', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMoock.onGet('/').reply(200, responseObject);
        heroesApiMoock.resetHistory();

        await getHeroesByPageAction('abc' as unknown as number);

        const params = heroesApiMoock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 0, category: 'all' })
    });


    test('should return the correct heroes when page is string number', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMoock.onGet('/').reply(200, responseObject);
        heroesApiMoock.resetHistory();

        await getHeroesByPageAction('5' as unknown as number);

        const params = heroesApiMoock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 6, offset: 24, category: 'all' })
    });

    test('should call the api with correct params', async () => {
        const responseObject = {
            total: 10,
            pages: 1,
            heroes: []
        };

        heroesApiMoock.onGet('/').reply(200, responseObject);
        heroesApiMoock.resetHistory();

        await getHeroesByPageAction(2, 10, 'heroes');

        const params = heroesApiMoock.history.get[0].params;
        expect(params).toStrictEqual({ limit: 10, offset: 10, category: 'heroes' })
    });
});