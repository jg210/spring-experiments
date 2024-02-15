import '@testing-library/jest-dom/vitest';

vi.mock("./src/FSA", async () => {
    const originalModule = await vi.importActual('./src/FSA');
    const neverResolves = () => new Promise( () => {} );
    return {
        ...originalModule,
        fetchEstablishmentsJson: vi.fn().mockImplementation(neverResolves)
    };
});
