import { useEffect, useState } from 'react';

import {
    ratingsPercentages,
    fetchEstablishmentsJson,
    RatingPercentage
} from './FSA';
import { TableRow } from './TableRow';

interface TableProps {
    localAuthorityId: number | null;
}

// Table showing percentage of establishments with each rating.
export const Table = ({ localAuthorityId }: TableProps) => {

    const [ scores, setScores ] = useState<RatingPercentage[] | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        setScores(null);
        if (localAuthorityId === null) {
            return;
        }
        fetchEstablishmentsJson(localAuthorityId, abortController)
            .then(ratingsPercentages)
            .then((scores: RatingPercentage[]) => {
                setScores(scores);
            })
            .catch(e => {
                if (!abortController.signal.aborted) {
                    throw e;
                }
            });
        return () => {
            abortController.abort();
        };
    }, [localAuthorityId]);

    if (localAuthorityId === null) {
        return null;
    }
    if (scores === null) {
        return (
            <div data-testid="table_loading">loading...</div>
        );
    }
    return (
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
    );
};
