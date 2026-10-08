import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
    id: '1',
    name: 'batman'
} as Hero

const TestComponent = () => {
    const { favoriteCount, favorites, isFavorite, toogleFavorite } = use(FavoriteHeroContext)
    return (
        (<div>
            <div data-testid="favorite-count">{favoriteCount}</div>
            <div data-testid="favorite-list">{
                favorites.map((hero) => (
                    <div key={hero.id} data-testid={`hero-${hero.id}`}>
                        {hero.name}
                    </div>
                ))
            }</div>
            <button data-testid="toogle-favorite"
                onClick={() => toogleFavorite(mockHero)}>
                Toggle Favorite</button>

            <div data-testid="is-favorite">
                {isFavorite(mockHero).toString()}</div>
        </div>)
    )
};

const renderContextTest = () => {
    return render(<FavoriteHeroProvider>
        <TestComponent />
    </FavoriteHeroProvider>);
}


describe('FavoriteHeroContext', () => {
    //Purgar
    afterEach(() => {
        localStorage.clear();
    });

    test('should inicialize with default values', () => {
        renderContextTest();

        screen.debug();

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('favorite-list').children.length).toBe(0);
    });

    test('should add hero to favorites when toogleFavorite is called with new hero', () => {
        renderContextTest();
        const button = screen.getByTestId('toogle-favorite');
        fireEvent.click(button);

        screen.debug();

        console.log(localStorage.getItem('favorites'));
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');
        expect(localStorage.getItem('favorites')).toBe('[{"id":"1","name":"batman"}]');
    });


    test('should remove hero to favorites when toogleFavorite is called', () => {
        localStorage.setItem('favorites', JSON.stringify([mockHero]))
        renderContextTest();
        expect(screen.getByTestId('favorite-count').textContent).toBe('1');
        expect(screen.getByTestId('is-favorite').textContent).toBe('true');
        expect(screen.getByTestId('hero-1').textContent).toBe('batman');

        const button = screen.getByTestId('toogle-favorite');
        fireEvent.click(button);

        expect(screen.getByTestId('favorite-count').textContent).toBe('0');
        expect(screen.getByTestId('is-favorite').textContent).toBe('false');
        expect(screen.queryByTestId('hero-1')).toBeNull();
        screen.debug();

    })
});
