import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from '@testing-library/react'
import { useHeroSummary } from "./useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getSummaryAction } from "../actions/get-summary-action";
import type { SummaryInformationResponse } from "../types/summary-information.response";

vi.mock('../actions/get-summary-action', () => ({
    getSummaryAction: vi.fn()
}))

const mockGetSummaryAction = vi.mocked(getSummaryAction)

const tanStackCustomProvider = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            }
        }
    });

    return ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('useHeroSummary', () => {
    test('Should return the initial state (isLoading)', () => {
        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider()
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.data).toBe(undefined);
        expect(result.current.data).toBeUndefined;
    });

    test('Should return success state with data when API call succeeds', async () => {
        const mockSummaryData = {
            totalHeroes: 25,
            strongestHero: {
                id: '1',
                name: 'Superman'
            },
            smartestHero: {
                id: '2',
                name: 'Batman'
            },
            heroCount: 18,
            villainCount: 7
        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSummaryData);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isError).toBe(false);
        expect(mockGetSummaryAction).toHaveBeenCalled();


        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.isError).toBe(false);
        // expect(result.current.data).toStrictEqual({
        //     totalHeroes: 25,
        //     strongestHero: {
        //         id: '1',
        //         name: 'Clark Kent',
        //         slug: 'clark-kent',
        //         alias: 'Superman',
        //         powers: expect.any(Array),
        //         description: 'El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.',
        //         strength: 10,
        //         intelligence: 8,
        //         speed: 9,
        //         durability: 10,
        //         team: 'Liga de la Justicia',
        //         image: '1.jpeg',
        //         firstAppearance: '1938',
        //         status: 'Active',
        //         category: 'Hero',
        //         universe: 'DC'
        //     },
        //     smartestHero: {
        //         id: '2',
        //         name: 'Bruce Wayne',
        //         slug: 'bruce-wayne',
        //         alias: 'Batman',
        //         powers: expect.any(Array),
        //         description: 'El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.',
        //         strength: 6,
        //         intelligence: 10,
        //         speed: 6,
        //         durability: 7,
        //         team: 'Liga de la Justicia',
        //         image: '2.jpeg',
        //         firstAppearance: '1939',
        //         status: 'Active',
        //         category: 'Hero',
        //         universe: 'DC'
        //     },
        //     heroCount: 18,
        //     villainCount: 7
        // });    
    });

    test('Should return error state when API call fails', async () => {
        const mockError = new Error('Failed to fetch summary');

        mockGetSummaryAction.mockRejectedValue(mockError);

        const { result } = renderHook(() => useHeroSummary(), {
            wrapper: tanStackCustomProvider()
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.isLoading).toBe(false);
        expect(mockGetSummaryAction).toHaveBeenCalled();

        expect(result.current.error?.message).toBe('Failed to fetch summary');

    });

});