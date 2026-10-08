import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock('@/heroes/hooks/usePaginatedHero');

const mockUsePaginatedteHero = vi.mocked(usePaginatedHero);

mockUsePaginatedteHero.mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    isSuccess: true
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <FavoriteHeroProvider>
                <QueryClientProvider client={queryClient}>
                    <HomePage />
                </QueryClientProvider>
            </FavoriteHeroProvider>
        </MemoryRouter>
    )
}

describe('HomePage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('Should render HomePage with default values', () => {
        const { container } = renderHomePage();
        expect(container).toMatchSnapshot();
    });

    test('Should call usePaginationHero with default values', () => {
        renderHomePage();
        expect(mockUsePaginatedteHero).toHaveBeenCalledWith(1, 6, 'all');
    });

    test('Should call usePaginationHero with custom query params', () => {
        renderHomePage(['/?page=2&limit=10&category=villains']);
        expect(mockUsePaginatedteHero).toHaveBeenCalledWith(2, 10, 'villains');
    });

    test('Should called usePaginatedHero with default page and same limit on tab ', () => {
        renderHomePage(['/?tab=favorites&page=2&limit=10']);
        const [, , , villansTab] = screen.getAllByRole('tab');
        fireEvent.click(villansTab);
        //screen.debug(villansTab);
        expect(mockUsePaginatedteHero).toHaveBeenCalledWith(1, 10, 'villain');
    });
});