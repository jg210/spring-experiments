import '@testing-library/jest-dom';


jest.mock("./src/FSA", () => {
    const neverResolves = () => new Promise( () => {} )
    return {
        fetchLocalAuthoritiesJson: neverResolves
    };
});
