import { useDebounce } from 'use-debounce';
import {
    ratingsPercentages,
    RatingPercentage,
    useGetEstablishmentsQuery,
    RATINGS_REFRESH_INTERVAL_SECONDS,
    fsaApi
} from './FSA';
import { TableRow } from './TableRow';
import { RetrievalDate } from './RetrievalDate';

interface TableProps {
    localAuthorityId: number;
}

const DEBOUNCE_INTERVAL_MILLIS = 1000;

export const onRetrievalDateTripleClick = () => { throw new Error("crash test") };

// Table showing percentage of establishments with each rating.
export const Table = ({ localAuthorityId }: TableProps) => {
    // Is the data in the RTK query cache?
    const cachedData = fsaApi.endpoints.getEstablishments.useQueryState(localAuthorityId).currentData;
    // Scrolling through list of local authorities by holding down up or down
    // arrow keys generates a lot of renders, so need to limit the number of
    // API requests.
    const [ localAuthorityIdDebounced ] = useDebounce(
        localAuthorityId,
        DEBOUNCE_INTERVAL_MILLIS,
        { leading: true }
    );
    // Using data (not currentData) means have something to show while
    // fetching. It doesn't get set to undefined, but keeps providing
    // the last result. This is visually less jarring than the "loading..."
    // text need before any data is loaded. Loading indication is instead done
    // using TableUpdating CSS style.
    const { data, isFetching } = useGetEstablishmentsQuery(localAuthorityIdDebounced, {
        pollingInterval: RATINGS_REFRESH_INTERVAL_SECONDS * 1000,
        refetchOnMountOrArgChange: RATINGS_REFRESH_INTERVAL_SECONDS
    });
    // The isPending() returned by useDebounce doesn't work if leading set to true,
    // so compare prop and debounced value instead.
    const isDebounced = localAuthorityId !== localAuthorityIdDebounced;
    const isCached = cachedData !== undefined;
    const isUpdating = !isCached && (isFetching || isDebounced);
    //console.log(JSON.stringify({isDebounced, isCached, isUpdating}));
    const establishments = isCached ? cachedData : data;
    if (establishments == undefined) {
        return (
            <div data-testid="table_loading">loading...</div>
        );
    }
    const scores = ratingsPercentages(establishments);
    const epoch = new Date(establishments.epochMillis);
    const tableClasses = ['Table'];
    if (isUpdating) {
        tableClasses.push('TableUpdating');
    }
    return (
        <div>
            <table className={tableClasses.join(" ")}>
                <thead>
                    <tr>
                        <th className="tableCell">Rating</th>
                        <th className="tableCell">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((ratingPercentage: RatingPercentage) => (
                        <TableRow ratingPercentage={ratingPercentage} key={ratingPercentage.rating}/>
                    ))}
                </tbody>
            </table>
            <RetrievalDate epoch={epoch} onTripleClick={onRetrievalDateTripleClick} />
        </div>
    );
};
