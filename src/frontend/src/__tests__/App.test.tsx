import { render, screen, waitFor, within } from '@testing-library/react';
import App from '../App';
import { fetchLocalAuthoritiesJson } from '../FSA';

function checkBoilerplate() {
  // banner
  const banner = screen.getByRole("banner");
  expect(banner).toHaveClass("App-header");
  // heading
  const heading = screen.getByRole("heading");
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
}

describe("App", () => {

  it('is run with correct node version', () => {
    expect(process.versions.node).toEqual("20.10.0");
  });

  it('renders correctly while loading', () => {
    render(<App/>);
    checkBoilerplate();
    expect(screen.getByText("loading...")).toBeInTheDocument(); // TODO check it's the right component that's showing loading - using e.g. test id.
  });

  it('renders authorities', async () => {
    const localAuthorities = [
      { name: "one", localAuthorityId: 243433 },
      { name: "two", localAuthorityId: 3823423 }
    ];
    const mockApi = jest.mocked(fetchLocalAuthoritiesJson);
    mockApi.mockResolvedValue(localAuthorities);
    render(<App/>);
    checkBoilerplate();
    await waitFor(() => { expect(mockApi).toHaveBeenCalledTimes(2) }); // TODO called twice.
    const dropdown = screen.getByTestId("authorities_select");
    expect(dropdown).toHaveValue(localAuthorities[0].localAuthorityId.toString());
    const options = within(dropdown).getAllByTestId("authorities_option");
    expect(options.length).toBe(localAuthorities.length);
    options.forEach((option, i) => {
      expect(option).toHaveValue(localAuthorities[i].localAuthorityId.toString());
    });
    checkBoilerplate();
    // TODO test clicking on authority.
  });


});
