import { useDebounce } from 'use-debounce';
import {
    ratingsPercentages,
    RatingPercentage,
    useGetEstablishmentsQuery,
    RATINGS_REFRESH_INTERVAL_SECONDS
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
    // Scrolling through list of local authorities by holding down up or down
    // arrow keys generates a lot of renders, so need to limit the number of
    // API requests.
    const [ localAuthorityIdDebounced ] = useDebounce(
        localAuthorityId,
        DEBOUNCE_INTERVAL_MILLIS,
        { leading: true }
    );
    const { currentData } = useGetEstablishmentsQuery(localAuthorityIdDebounced, {
        pollingInterval: RATINGS_REFRESH_INTERVAL_SECONDS * 1000,
        refetchOnMountOrArgChange: RATINGS_REFRESH_INTERVAL_SECONDS
    });
    // The isPending() returned by useDebounce doesn't work if leading set to true,
    // so compare prop and debounced value instead.
    const debounced = localAuthorityId !== localAuthorityIdDebounced;
    if (currentData == undefined || debounced) {
        return (
            <div data-testid="table_loading">loading...</div>
        );
    }
    const scores = ratingsPercentages(currentData);
    const epoch = new Date(currentData.epochMillis);
    return (
        <div>
            <table className="Table">
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
