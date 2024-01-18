import { render, screen } from '@testing-library/react'
import App from '../App';

function checkBoilerplate() {
  // banner
  const banner = screen.getByRole("banner");
  expect(banner).toHaveClass("App-header")
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
    expect(screen.getByText("loading...")).toBeInTheDocument() // TODO check it's the right component that's showing loading - using e.g. test id.
  });

  // it('renders authorities', async () => {
    // const localAuthorities: LocalAuthorities = {
    //   localAuthorities: [
    //     { name: "one", localAuthorityId: 1 },
    //     { name: "two", localAuthorityId: 2 }
    //   ]
    // }
    // const mockApi = jest.fn().mockResolvedValue(localAuthorities);
    // jest.mock("../FSA", () => {
    //   return {
    //     fetchLocalAuthoritiesJson: mockApi
    //   };
    // });
    // render(<App/>);
    // checkBoilerplate();
    // await waitFor(() => { () => expect(mockApi).toHaveBeenCalled()});
    // checkBoilerplate();
    // // TODO test fails since still in loading, since mock redefinition not working.
    //const dropdown = screen.getByTestId("authorities_select");
    //const options = within(dropdown).getAllByTestId("authorities_option");
  // });

  // TODO test clicking on authority.

});
