import { render } from '@testing-library/react'
import App from '../App';

describe("App", () => {

  it('is run with correct node version', () => {
    expect(process.versions.node).toEqual("20.10.0");
  });

  it('renders without crashing', () => {
    render(<App />);
  });

});
