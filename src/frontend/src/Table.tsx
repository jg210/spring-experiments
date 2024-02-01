import { useEffect, useRef, useState } from 'react';

import {
    ratingsPercentages,
    fetchEstablishmentsJson,
    RatingPercentage
} from './FSA';

interface Props {
    localAuthorityId: number | null;
}

// Table showing percentage of establishments with each rating.
export const Table = ({ localAuthorityId }: Props) => {

    const [ scores, setScores ] = useState<RatingPercentage[] | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (abortControllerRef.current !== null) {
            abortControllerRef.current.abort();
        }
        setScores(null);
        if (localAuthorityId === null) {
            return;
        }
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        fetchEstablishmentsJson(localAuthorityId, abortController)
            .then(ratingsPercentages)
            .then((scores: RatingPercentage[]) => {
                setScores(scores);
                abortControllerRef.current = null;
            })
            .catch(e => {
                if (!abortController.signal.aborted) {
                    throw e;
                }
            });
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
                {scores.map((score: RatingPercentage, i) => (
                    <tr key={i}>
                        <td>{score.rating}</td>
                        <td>{Math.round(score.percentage)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
