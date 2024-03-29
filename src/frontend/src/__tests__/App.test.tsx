import { render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { App } from '../App';
import { BASE_PATHNAME, Establishments, LocalAuthorities, LocalAuthority, Ratings } from '../FSA';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { RenderWithStore, serverURL } from './util';
import { escapeRegExp, flatMap, last } from 'lodash';

const epoch = new Date("February 14, 2024 20:14:00");

function checkBoilerplate() {
  // banner
  const banner = screen.getByRole("banner");
  expect(banner).toHaveClass("app-header");
  // heading
  const heading = screen.getByRole("heading");
  expect(heading).toHaveClass("app-title");
  expect(heading).toHaveTextContent("FSA Food Hygiene Ratings");
  // blurb
  const blurb = screen.getByTestId("blurb");
  expect(blurb).toHaveTextContent("The information provided here is based on data from the Food Standards Agency UK Food Hygiene Rating Data");
  // T&C URL
  const url = "https://www.food.gov.uk/terms-and-conditions";
  const element = screen.getByText(url);
  expect(element).toHaveAttribute("href", url);
}

async function checkAuthoritiesList() {
  const dropdown = await screen.findByTestId("authorities_select", undefined, { timeout: 2000 });
  expect(dropdown).toHaveValue(localAuthorities[0].localAuthorityId.toString());
  const options = within(dropdown).getAllByTestId("authorities_option") as HTMLOptionElement[];
  expect(options.length).toBe(localAuthorities.length);
  options.forEach((option, i) => {
    expect(option).toHaveValue(localAuthorities[i].localAuthorityId.toString());
  });
}

async function prepareToClickOnAuthority() {
  const user = userEvent.setup();
  render(<RenderWithStore><App/></RenderWithStore>);
  checkBoilerplate();
  await checkAuthoritiesList();
  checkBoilerplate();
  expect(establishmentRequestLocalAuthorityIds()).toHaveLength(0);
  return user;
}

async function selectLocalAuthority(
  localAuthorityId: number,
  user: UserEvent
) {
  const authoritiesSelect = screen.getByTestId("authorities_select");
  await user.selectOptions(authoritiesSelect, [localAuthorityId.toString()]);

  // Wait for data to appear, using localAuthorityId passed as a fake rating.
  const localAuthorityIdToken = localAuthorityIdToToken(localAuthorityId);
  await screen.findByText(localAuthorityIdToken, undefined, { timeout: 5000 });

  // A table of ratings is visible
  const table = screen.getByRole("table");
  expect(table).toHaveClass("table");
  const rowGroups = within(table).getAllByRole("rowgroup");
  expect(rowGroups.length).toBe(2);
  const [tableHeader, tableBody] = rowGroups;
  const headerRows = within(tableHeader).getAllByRole("row");
  expect(headerRows.length).toBe(1);
  const [headerRow] = headerRows;
  const headerCells = within(headerRow).getAllByRole("columnheader");
  headerCells.forEach((headerCell) => {
    expect(headerCell).toHaveClass("table-cell");
  });
  expect(headerCells.length).toBe(2);
  expect(headerCells[0]).toHaveTextContent("Rating");
  expect(headerCells[1]).toHaveTextContent("Percentage");
  const bodyRows = within(tableBody).getAllByRole("row");
  const establishmentsExpected = establishmentsJson(localAuthorityId);
  const ratingsExpectedInTable = expectedRatings(establishmentsExpected, ratings);
  expect(bodyRows.length).toEqual(ratingsExpectedInTable.length);
  let totalPercentage = 0;
  bodyRows.forEach((bodyRow, i) => {
    const bodyRowCells = within(bodyRow).getAllByRole("cell");
    expect(bodyRowCells.length).toBe(2);
    const [ratingCell, percentageCell] = bodyRowCells;
    expect(ratingCell).toHaveTextContent(ratingsExpectedInTable[i]);
    expect(percentageCell).toHaveTextContent(/^[0-9]+%$/);
    totalPercentage += parseFloat(percentageCell.textContent!.replace(/%$/, ""));
    // TableRow.test.tsx has more detailed tests.
  });
  expect(totalPercentage).toBeCloseTo(100);
  expect(screen.getByTestId("retrieved")).toHaveTextContent(`retrieved ${epoch.toLocaleString()}`);

  // There's still boilerplate after clicking on authority.
  checkBoilerplate();
}

const localAuthorityIdToName = (localAuthorityId: number) => `localAuthorityId_${localAuthorityId}`;
// A hack, so test can wait for this data to appear. String needs to be different to the localAuthorityIdToName() return values.
// It ends in _ to make sure don't match e.g. id 12345 with token for 123.
const localAuthorityIdToToken = (localAuthorityId: number) => `LOCAL_AUTHORITY_ID_TOKEN_${localAuthorityId}_`;

// Mock the API.
const localAuthorities: LocalAuthority[] = [
  4874,
  53567
].map(localAuthorityId => {
  return {
    name: localAuthorityIdToName(localAuthorityId),
    localAuthorityId
  };
});
const localAuthorityId0 = localAuthorities[0].localAuthorityId;
const localAuthorityId1 = localAuthorities[1].localAuthorityId;
const establishmentsJson : (localAuthorityId: number) => Establishments = (localAuthorityId) => ({
  epochMillis: epoch.getTime(),
  ratingCounts: [
    { rating: "good", count: 12334234 },
    { rating: "bad",  count: 232 },
    { rating: "ugly", count: 0 },
    { rating: localAuthorityIdToToken(localAuthorityId), count: 0 }
  ]
});
const ratings = [ "good", "bad", "ugly", "not in establishments json" ];

// The ordered list of table body row ratings expect.
const expectedRatings = (establishments: Establishments, ratings: string[]) => {
  const unorderedRows = new Set([
    ...establishments.ratingCounts.map((ratingcount) => ratingcount.rating),
    ...ratings
  ]);
  return Array.from(unorderedRows).sort();
};

// Use MSW events (subscribed to later on) to check what requests have been made.
type ResponseRecord = { request: Request, response: Response };
const responseRecords : ResponseRecord[] = [];
// Filters out just establishment json requests, then parses the local authority id.
const establishmentRequestLocalAuthorityIds = () => flatMap(responseRecords, (responseRecord => {
  const url = new URL(responseRecord.request.url);
  const pattern = escapeRegExp(`${BASE_PATHNAME}/localAuthority/`) + '([0-9]+)';
  const match = url.pathname.match(pattern);
  if (match) {
    return parseInt(match[1]);
  } else {
    return [];
  }
}));

// Configure mocking of API.
//
// TODO can any of these types be inferred from RTK Query API?
type LocalAuthoritiesParams = Record<string,never>;
type LocalAuthoritiesRequestBody = Record<string,never>;
type LocalAuthoritiesResponseBody = LocalAuthorities;
type LocalAuthorityParams = { localAuthorityId: string };
type LocalAuthorityRequestBody = Record<string,never>;
type LocalAuthorityResponseBody = Establishments;
type RatingsParams = Record<string,never>;
type RatingsRequestBody = Record<string,never>;
type RatingsResponseBody = Ratings;

const server = setupServer(
  http.get<LocalAuthoritiesParams, LocalAuthoritiesRequestBody, LocalAuthoritiesResponseBody>(
    serverURL("localAuthority"),
    () => HttpResponse.json({ localAuthorities })
  ),
  http.get<LocalAuthorityParams, LocalAuthorityRequestBody, LocalAuthorityResponseBody>(
    serverURL("localAuthority/:localAuthorityId"),
    ({ params }) => {
      const localAuthorityId = parseInt(params.localAuthorityId);
      return HttpResponse.json(establishmentsJson(localAuthorityId));
    }
  ),
  http.get<RatingsParams, RatingsRequestBody, RatingsResponseBody>(
    serverURL("ratings"),
    () => HttpResponse.json({ ratings })
  )
);
// console.log(JSON.stringify(server.listHandlers(), null, "  "));

// Subscribe to MSW https://mswjs.io/docs/api/life-cycle-events
//
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
    vi.restoreAllMocks();
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

  it('shows rating if click on establishments, caching data correctly', async () => {
    const user = await prepareToClickOnAuthority();

    // item 0.
    await selectLocalAuthority(localAuthorityId0, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(1);
    expect(last(establishmentRequestLocalAuthorityIds())).toEqual(localAuthorityId0);

    // item 1.
    await selectLocalAuthority(localAuthorityId1, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(2);
    expect(last(establishmentRequestLocalAuthorityIds())).toEqual(localAuthorityId1);

    // item 0 again.
    await selectLocalAuthority(localAuthorities[1].localAuthorityId, user);
    expect(establishmentRequestLocalAuthorityIds()).toHaveLength(2); // cached by RTK query.
  });

  describe("retries Establishments request...", () => {
    it('...on network error', async () => {
      server.use(
        http.get(
          serverURL("localAuthority/:localAuthorityId"),
          () => HttpResponse.error(),
          { once: true }
        )
      );
      const user = await prepareToClickOnAuthority();
      await selectLocalAuthority(localAuthorityId0, user);
      expect(establishmentRequestLocalAuthorityIds()).toEqual([localAuthorityId0]); // network errors aren't sent as MSW events.
    });

    it('...on 429 response', async () => {
      server.use(
        http.get(
          serverURL("localAuthority/:localAuthorityId"),
          () => new HttpResponse('busy', { status: 429 }),
          { once: true }
        )
      );
      const user = await prepareToClickOnAuthority();
      await selectLocalAuthority(localAuthorityId0, user);
      expect(establishmentRequestLocalAuthorityIds()).toEqual([localAuthorityId0, localAuthorityId0]);
    });

    it('...on 502 response', async () => {
      server.use(
        http.get(
          serverURL("localAuthority/:localAuthorityId"),
          () => new HttpResponse('timeout', { status: 502 }),
          { once: true }
        )
      );
      const user = await prepareToClickOnAuthority();
      await selectLocalAuthority(localAuthorityId0, user);
      expect(establishmentRequestLocalAuthorityIds()).toEqual([localAuthorityId0, localAuthorityId0]);
    });
  });

  describe("retries LocalAuthorities request...", () => {
    it("...on network error", async () => {
      server.use(
        http.get(serverURL("localAuthority"), () => {
          return HttpResponse.error();
        }, { once: true })
      );
      render(<RenderWithStore><App/></RenderWithStore>);
      await checkAuthoritiesList();
    });

    it("...on 429 response", async () => {
      server.use(
        http.get(serverURL("localAuthority"), () => {
          return new HttpResponse('busy', { status: 429 });
        }, { once: true })
      );
      render(<RenderWithStore><App/></RenderWithStore>);
      await checkAuthoritiesList();
    });

    it("...on 502 response", async () => {
      server.use(
        http.get(serverURL("localAuthority"), () => {
          return new HttpResponse('timeout', { status: 502 });
        }, { once: true })
      );
      render(<RenderWithStore><App/></RenderWithStore>);
      await checkAuthoritiesList();
    });
  });

  describe("cookie consent", () => {
    const cookieConsentTextPattern = /This site uses cookies/;
    it("is rendered when load app", () => {
      render(<RenderWithStore><App/></RenderWithStore>);
      const cookieConsent = screen.getByText(cookieConsentTextPattern);
      expect(cookieConsent).toBeVisible();
    });
    it("goes away when click on it", async () => {
      const { rerender } = render(<RenderWithStore><App/></RenderWithStore>);
      const cookieConsentButton = screen.getByRole("button", { name : "Accept cookies"});
      expect(cookieConsentButton).toHaveTextContent("I understand");
      const user = userEvent.setup();
      await user.click(cookieConsentButton);
      expect(screen.queryByText(cookieConsentTextPattern)).not.toBeInTheDocument();
      rerender(<RenderWithStore><App/></RenderWithStore>);
      expect(screen.queryByText(cookieConsentTextPattern)).not.toBeInTheDocument();
    });
  });

});
