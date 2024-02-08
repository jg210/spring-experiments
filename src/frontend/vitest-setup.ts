import '@testing-library/jest-dom/vitest';

jest.mock("./src/FSA", () => {
    const originalModule = jest.requireActual('./src/FSA');
    const neverResolves = () => new Promise( () => {} );
    return {
        ...originalModule,
        fetchLocalAuthoritiesJson: jest.fn().mockImplementation(neverResolves),
        fetchEstablishmentsJson: jest.fn().mockImplementation(neverResolves)
    };
});
