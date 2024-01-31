import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { Establishments, LocalAuthority, fetchEstablishmentsJson, fetchLocalAuthoritiesJson } from '../FSA';

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

  it('shows rating if click on establishment', async () => {
    
    const user = userEvent.setup();
    
    // Mock the local authorities API
    const localAuthorities: LocalAuthority[] = [
      { name: "one", localAuthorityId: 243433 },
      { name: "two", localAuthorityId: 3823423 }
    ];
    const fetchLocalAuthoritiesJsonMock = jest.mocked(fetchLocalAuthoritiesJson);
    fetchLocalAuthoritiesJsonMock.mockResolvedValue(localAuthorities);
    
    // Mock the establishements API.
    const establishmentsJson : Establishments = {
      ratingCounts: [
        { rating: "good", count: 12334234 },
        { rating: "bad",  count: 232 },
        { rating: "ugly", count: 0 }
      ]
    };
    const fetchEstablishementsJsonMock = jest.mocked(fetchEstablishmentsJson);
    fetchEstablishementsJsonMock.mockResolvedValue(establishmentsJson);

    render(<App/>);

    // Loading
    checkBoilerplate();
    await waitFor(() => {
      expect(fetchLocalAuthoritiesJsonMock).toHaveBeenCalledTimes(2);
    });

    // Authorities list loaded.
    const dropdown = screen.getByTestId("authorities_select");
    expect(dropdown).toHaveValue(localAuthorities[0].localAuthorityId.toString());
    const options = within(dropdown).getAllByTestId("authorities_option");
    expect(options.length).toBe(localAuthorities.length);
    options.forEach((option, i) => {
      expect(option).toHaveValue(localAuthorities[i].localAuthorityId.toString());
    });
    checkBoilerplate();
    expect(fetchEstablishementsJsonMock).toHaveBeenCalledTimes(0);
    
    // Clicking on an authority
    const toClickOn = 0; // TODO Why does test fail if change this to 1?
    await user.click(options[toClickOn]);
    expect(fetchEstablishementsJsonMock).toHaveBeenCalledTimes(1);
    expect(fetchEstablishementsJsonMock).toHaveBeenCalledWith(
      localAuthorities[toClickOn].localAuthorityId,
      expect.any(AbortController)
    );

    // A table of ratings is visible
    const table = screen.getByRole("table");
    const rowGroups = within(table).getAllByRole("rowgroup");
    expect(rowGroups.length).toBe(2);
    const [ tableHeader, tableBody ] = rowGroups;
    const headerRows = within(tableHeader).getAllByRole("row");
    expect(headerRows.length).toBe(1);
    const [ headerRow ] = headerRows;
    const headerCells = within(headerRow).getAllByRole("columnheader");
    expect(headerCells.length).toBe(2);
    expect(headerCells[0]).toHaveTextContent("Rating");
    expect(headerCells[1]).toHaveTextContent("Percentage");
    const bodyRows = within(tableBody).getAllByRole("row");
    expect(bodyRows.length).toEqual(establishmentsJson.ratingCounts.length);
    let totalPercentage = 0;
    bodyRows.forEach((bodyRow, i) => {
      const bodyRowCells = within(bodyRow).getAllByRole("cell");
      expect(bodyRowCells.length).toBe(2);
      const [ ratingCell, percentageCell ] = bodyRowCells;
      expect(ratingCell).toHaveTextContent(establishmentsJson.ratingCounts[i].rating);
      expect(percentageCell).toHaveTextContent(/^[0-9]+%$/);
      totalPercentage += parseFloat(percentageCell.textContent!.replace(/%$/, ""));
    });
    expect(totalPercentage).toBeCloseTo(100);

    // There's still boilerplate after clicking on authority.
    checkBoilerplate();

  });


});
