import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock("./src/FSA", async () => {
    const originalModule = await vi.importActual('./src/FSA');
    const neverResolves = () => new Promise( () => {} );
    return {
        ...originalModule,
        fetchLocalAuthoritiesJson: vi.fn().mockImplementation(neverResolves),
        fetchEstablishmentsJson: vi.fn().mockImplementation(neverResolves)
    };
});
