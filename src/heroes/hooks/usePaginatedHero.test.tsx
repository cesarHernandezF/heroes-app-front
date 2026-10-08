import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page-action";


vi.mock('../actions/get-heroes-by-page-action', () => ({
    getHeroesByPageAction: vi.fn()
}));

const mockGetHeroresByPageAction = vi.mocked(getHeroesByPageAction);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

const tanStackCustomProvider = () => {

    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('usePaginatedHero', () => {
    //Purgar
    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    })

    test('Should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined;
    });

    test('Should return success state with data when API call succeeds', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        };

        mockGetHeroresByPageAction.mockResolvedValue(mockHeroesData);

        const { result } = renderHook(() => usePaginatedHero(1, 6), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroresByPageAction).toHaveBeenCalled();
        expect(mockGetHeroresByPageAction).toHaveBeenCalledWith(1, 6, 'all');
    });


    test('Should call getHeroesByPageActions with arguments', async () => {
        const mockHeroesData = {
            total: 20,
            pages: 4,
            heroes: [],
        };

        mockGetHeroresByPageAction.mockResolvedValue(mockHeroesData);

        const { result } = renderHook(() => usePaginatedHero(1, 6, 'heroesABC'), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroresByPageAction).toHaveBeenCalled();
        expect(mockGetHeroresByPageAction).toHaveBeenCalledWith(1, 6, 'heroesABC');
    });
});