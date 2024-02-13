import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';
import { Establishments, LocalAuthorities, LocalAuthority } from '../FSA';
import { setupServer } from 'msw/node';
import { http, HttpResponse, StrictResponse } from 'msw';
import { RenderWithStore, serverURL } from './util';

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

// Mock the API.
const toClickOn = 0; // TODO Why doesn't test fail if change to 1?
const localAuthorities: LocalAuthority[] = [
  { name: "one", localAuthorityId: 243433 },
  { name: "two", localAuthorityId: 3823423 }
];
const establishmentsJson : Establishments = {
  ratingCounts: [
    { rating: "good", count: 12334234 },
    { rating: "bad",  count: 232 },
    { rating: "ugly", count: 0 }
  ]
};
type LocalAuthorityParams = Record<string,never>;
type LocalAuthorityRequestBody = Record<string,never>;
type LocalAuthorityResponseBody = LocalAuthorities;
type LocalAuthoritiesParams = { localAuthorityId: string };
type LocalAuthoritiesRequestBody = Record<string,never>;
type LocalAuthoritiesResponseBody = Establishments | never;
const server = setupServer(
  http.get<LocalAuthorityParams, LocalAuthorityRequestBody, LocalAuthorityResponseBody>(serverURL("localAuthority"), () => {
    return HttpResponse.json({ localAuthorities });
  }),
  http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
    serverURL("localAuthority/:localAuthorityId"),
    ({ params }) => {
      const { localAuthorityId } = params;
      if (localAuthorityId !== localAuthorities[toClickOn].localAuthorityId.toString()) {
        // Throwing exception here fails test since prevents http response, but there's
        // no logging, which is confusing. Instead, return unexpected response and rely on test
        // not getting the values it expects. It's not logged either by default, but would be
        // visible if uncomment MSW event logging below...
        return new HttpResponse(`wrong localAuthorityId: ${localAuthorityId}`, {
          status: 404,
          headers: {
            'Content-Type': 'text/plain',
          }
        }) as StrictResponse<never>; // https://github.com/mswjs/msw/issues/1792#issuecomment-1785273131
      }
      return HttpResponse.json(establishmentsJson);
    }
  )
);
//console.log(JSON.stringify(server.listHandlers(), null, "  "));
// Log https://mswjs.io/docs/api/life-cycle-events
// server.events.on('request:start', ({ request, requestId }) => {
//   console.log('request:start:', requestId, request.method, request.url);
// });
// server.events.on('request:match', ({ request, requestId }) => {
//   console.log("request:match:", requestId, request.method, request.url);
// });
// server.events.on('response:mocked', ({ request, response }) => {
//   console.log(
//     'response:mocked: %s %s %s %s',
//     request.method,
//     request.url,
//     response.status,
//     response.statusText
//   );
// });

describe("App", () => {

  beforeAll(() => server.listen({
    onUnhandledRequest: 'error'
  }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('is run with correct node version', () => {
    expect(process.versions.node).toEqual("20.10.0");
  });

  it('renders correctly while loading', () => {
    render(<RenderWithStore><App/></RenderWithStore>);
    checkBoilerplate();
    expect(screen.getByTestId("authorities_loading")).toHaveTextContent(/^loading...$/);
  });

  it('shows rating if click on establishment', async () => {
    
    const user = userEvent.setup();

    render(<RenderWithStore><App/></RenderWithStore>);

    // Loading
    checkBoilerplate();

    // Authorities list loaded.
    const dropdown = await screen.findByTestId("authorities_select");
    expect(dropdown).toHaveValue(localAuthorities[0].localAuthorityId.toString());
    const options = within(dropdown).getAllByTestId("authorities_option");
    expect(options.length).toBe(localAuthorities.length);
    options.forEach((option, i) => {
      expect(option).toHaveValue(localAuthorities[i].localAuthorityId.toString());
    });
    checkBoilerplate();
    
    // Clicking on an authority
    await user.click(options[toClickOn]);

    // A table of ratings is visible
    const table = await screen.findByRole("table");
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
