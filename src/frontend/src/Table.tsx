import { Component } from 'react';

import {
    ratingsPercentages,
    fetchEstablishmentsJson,
    RatingPercentage
} from './FSA';

const LOADING_STATE : State = {
    scores: null
};

interface Props {
    localAuthorityId: number | null;
}

interface State {
    scores: RatingPercentage[] | null
}

// Table showing percentage of establishments with each rating.
export class Table extends Component<Props,State> {

    state: State = {
        ...LOADING_STATE
    };
    abortController: AbortController | null = null;

    render() {
        if (this.props.localAuthorityId === null) {
            return null;
        }
        if (this.state.scores === null) {
            return (
                <div>loading...</div>
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
                    {this.state.scores.map((score: RatingPercentage, i) => (
                        <tr key={i}>
                            <td>{score.rating}</td>
                            <td>{Math.round(score.percentage)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    componentDidUpdate(prevProps: Props) {
        const localAuthorityId = this.props.localAuthorityId;
        if (localAuthorityId === prevProps.localAuthorityId) {
            return;
        }
        if (this.abortController !== null) {
            this.abortController.abort();
        }
        this.setState({...LOADING_STATE});
        if (localAuthorityId === null) {
            return;
        }
        const abortController = new AbortController();
        this.abortController = abortController;
        fetchEstablishmentsJson(localAuthorityId, this.abortController)
            .then(ratingsPercentages)
            .then((scores: RatingPercentage[]) => {
                this.setState({ scores });
                this.abortController = null;
            })
            .catch(e => {
                if (!abortController.signal.aborted) {
                    throw e;
                }
            });
    }

}


