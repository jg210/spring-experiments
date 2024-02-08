import { useEffect, useState } from 'react';

import {
    ratingsPercentages,
    fetchEstablishmentsJson,
    RatingPercentage
} from './FSA';

interface TableProps {
    localAuthorityId: number | null;
}

interface TableRowProps {
    ratingPercentage: RatingPercentage;
    key: number
}

const TableRow = ({ ratingPercentage, key }: TableRowProps) => {
    return (
        <tr key={key}>
            <td>{ratingPercentage.rating}</td>
            <td>{Math.round(ratingPercentage.percentage)}%</td>
        </tr>
    );
};

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
                    <th>Rating</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                {scores.map((ratingPercentage: RatingPercentage, key) => (
                    <TableRow ratingPercentage={ratingPercentage} key={key}/>
                ))}
            </tbody>
        </table>
    );
};
