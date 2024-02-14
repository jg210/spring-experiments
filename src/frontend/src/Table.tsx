import {
    ratingsPercentages,
    RatingPercentage,
    useGetEstablishmentsQuery,
    RATINGS_REFRESH_INTERVAL_SECONDS
} from './FSA';
import { TableRow } from './TableRow';

interface TableProps {
    localAuthorityId: number;
}

// Table showing percentage of establishments with each rating.
export const Table = ({ localAuthorityId }: TableProps) => {
    const { currentData } = useGetEstablishmentsQuery(localAuthorityId, {
        pollingInterval: RATINGS_REFRESH_INTERVAL_SECONDS * 1000,
        refetchOnMountOrArgChange: RATINGS_REFRESH_INTERVAL_SECONDS
    });
    if (currentData == undefined) {
        return (
            <div data-testid="table_loading">loading...</div>
        );
    }
    const scores = ratingsPercentages(currentData);
    const dateString = new Date(currentData.epochMillis).toLocaleString();
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
                    {scores.map((ratingPercentage: RatingPercentage, i) => (
                        <TableRow ratingPercentage={ratingPercentage} key={i}/>
                    ))}
                </tbody>
            </table>
            <div data-testid="retrieved" className="retrieved">retrieved {dateString}</div>
        </div>
    );
};
