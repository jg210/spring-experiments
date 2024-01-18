import { render, screen } from '@testing-library/react'
import App from '../App';

describe("App", () => {

  it('is run with correct node version', () => {
    expect(process.versions.node).toEqual("20.10.0");
  });

  it('renders correctly while loading', () => {
    render(<App/>);
    const heading = screen.getByRole("heading");
    // heading
    expect(heading).toHaveClass("App-title");
    expect(heading).toHaveTextContent("FSA Food Hygiene Ratings");
    // blurb
    const blurb = screen.getByText("The information provided here is based on data from the Food Standards Agency UK Food Hygiene Rating Data API.");
    expect(blurb).toBeInTheDocument();
    // URLs
    [
      "https://ratings.food.gov.uk",
      "https://www.food.gov.uk/terms-and-conditions"
    ].forEach(url => {
      const element = screen.getByText(url);
      expect(element).toHaveAttribute("href", url);
    });
    // loading...
    expect(screen.getByText("loading...")).toBeInTheDocument()
  });

  // TODO test loading of URLs.
  // TODO test clicking on authority.

});
