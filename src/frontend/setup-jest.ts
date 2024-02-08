import 'whatwg-fetch';
import '@testing-library/jest-dom';

jest.mock("./src/FSA", () => {
    const originalModule = jest.requireActual('./src/FSA');
    const neverResolves = () => new Promise( () => {} );
    return {
        ...originalModule,
        fetchEstablishmentsJson: jest.fn().mockImplementation(neverResolves)
    };
});
