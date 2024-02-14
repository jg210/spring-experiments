import { render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { App } from '../App';
import { BASE_PATHNAME, Establishments, LocalAuthorities, LocalAuthority } from '../FSA';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { RenderWithStore, serverURL } from './util';
import { escapeRegExp, flatMap, last } from 'lodash';

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

async function selectLocalAuthority(
  localAuthorityId: number,
  user: UserEvent
) {
  const authoritiesSelect = screen.getByTestId("authorities_select");
  await user.selectOptions(authoritiesSelect, [localAuthorityId.toString()]);

  // Wait for data to appear, using localAuthorityId passed as a fake rating.
  const localAuthorityIdToken = localAuthorityIdToToken(localAuthorityId);
  await screen.findByText(localAuthorityIdToken);

  // A table of ratings is visible
  const table = screen.getByRole("table");
  const rowGroups = within(table).getAllByRole("rowgroup");
  expect(rowGroups.length).toBe(2);
  const [tableHeader, tableBody] = rowGroups;
  const headerRows = within(tableHeader).getAllByRole("row");
  expect(headerRows.length).toBe(1);
  const [headerRow] = headerRows;
  const headerCells = within(headerRow).getAllByRole("columnheader");
  expect(headerCells.length).toBe(2);
  expect(headerCells[0]).toHaveTextContent("Rating");
  expect(headerCells[1]).toHaveTextContent("Percentage");
  const bodyRows = within(tableBody).getAllByRole("row");
  expect(bodyRows.length).toEqual(establishmentsJson(localAuthorityId).ratingCounts.length);
  let totalPercentage = 0;
  bodyRows.forEach((bodyRow, i) => {
    const bodyRowCells = within(bodyRow).getAllByRole("cell");
    expect(bodyRowCells.length).toBe(2);
    const [ratingCell, percentageCell] = bodyRowCells;
    expect(ratingCell).toHaveTextContent(establishmentsJson(localAuthorityId).ratingCounts[i].rating);
    expect(percentageCell).toHaveTextContent(/^[0-9]+%$/);
    totalPercentage += parseFloat(percentageCell.textContent!.replace(/%$/, ""));
  });
  expect(totalPercentage).toBeCloseTo(100);

  // There's still boilerplate after clicking on authority.
  checkBoilerplate();
}

const localAuthorityIdToName = (localAuthorityId: number) => `localAuthorityId_${localAuthorityId}`;
// A hack, so test can wait for this data to appear. String needs to be different to the localAuthorityIdToName() return values.
// It ends in _ to make sure don't match e.g. id 12345 with token for 123.
const localAuthorityIdToToken = (localAuthorityId: number) => `LOCAL_AUTHORITY_ID_TOKEN_${localAuthorityId}_`;

// Mock the API.
const localAuthorities: LocalAuthority[] = [
  243433,
  3823423
].map(localAuthorityId => {
  return {
    name: localAuthorityIdToName(localAuthorityId),
    localAuthorityId
  };
});
const establishmentsJson : (localAuthorityId: number) => Establishments = (localAuthorityId) => ({
  ratingCounts: [
    { rating: "good", count: 12334234 },
    { rating: "bad",  count: 232 },
    { rating: "ugly", count: 0 },
    { rating: localAuthorityIdToToken(localAuthorityId), count: 0 }
  ]
});
type ResponseRecord = { request: Request, response: Response };
const responseRecords : ResponseRecord[] = [];
// TODO can any of these types be inferred from RTK Query API?
type LocalAuthorityParams = Record<string,never>;
type LocalAuthorityRequestBody = Record<string,never>;
type LocalAuthorityResponseBody = LocalAuthorities;
type LocalAuthoritiesParams = { localAuthorityId: string };
type LocalAuthoritiesRequestBody = Record<string,never>;
type LocalAuthoritiesResponseBody = Establishments;
const server = setupServer(
  http.get<LocalAuthorityParams, LocalAuthorityRequestBody, LocalAuthorityResponseBody>(serverURL("localAuthority"), () => {
    return HttpResponse.json({ localAuthorities });
  }),
  http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
    serverURL("localAuthority/:localAuthorityId"),
    ({ params }) => {
      const localAuthorityId = parseInt(params.localAuthorityId);
      return HttpResponse.json(establishmentsJson(localAuthorityId));
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
server.events.on('response:mocked', ({ request, response }) => {
  // console.log(
  //   'response:mocked: %s %s %s %s',
  //   request.method,
  //   request.url,
  //   response.status,
  //   response.statusText
  // );
  responseRecords.push({ request: request.clone(), response: response.clone() });
});

describe("App", () => {

  beforeAll(() => server.listen({
    onUnhandledRequest: 'error'
  }));
  afterEach(() => {
    server.resetHandlers();
    responseRecords.length = 0;
  });
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
    const options = within(dropdown).getAllByTestId("authorities_option") as HTMLOptionElement[];
    expect(options.length).toBe(localAuthorities.length);
    options.forEach((option, i) => {
      expect(option).toHaveValue(localAuthorities[i].localAuthorityId.toString());
    });
    checkBoilerplate();

    // Clicking on an authority

    // Filters out just establishment json requests, then parses the local authority id.
    const establishmentRequestLocalAuthorityIds = () => flatMap(responseRecords, (responseRecord => {
      const url = new URL(responseRecord.request.url);
      const pattern = escapeRegExp(`${BASE_PATHNAME}/localAuthority/`) + '([0-9]+)';
      const match = url.pathname.match(pattern);
      return match ? [ match[1] ] : [];
    }));

    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(0);

    // Click on one item.
    const localAuthorityId0 = localAuthorities[0].localAuthorityId;
    await selectLocalAuthority(localAuthorityId0, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(1);
    expect(last(establishmentRequestLocalAuthorityIds())).toEqual(localAuthorityId0.toString());

    // Click on another item.
    const localAuthorityId1 = localAuthorities[1].localAuthorityId;
    await selectLocalAuthority(localAuthorityId1, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(2);
    expect(last(establishmentRequestLocalAuthorityIds())).toEqual(localAuthorityId1.toString());

    // Clicking on second item again.
    await selectLocalAuthority(localAuthorities[1].localAuthorityId, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(2); // cached by RTK query.

  });

});
