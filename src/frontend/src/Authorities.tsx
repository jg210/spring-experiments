import React, { Component } from 'react';
import {
    fetchLocalAuthoritiesJson,
    LocalAuthority
} from './FSA';

interface Props {
    onClick: (localAuthorityId: number) => void
}

interface State {
    localAuthorities: LocalAuthority[] | null
}

// Drop down list that populates itself with list of local authorities.
export class Authorities extends Component<Props,State> {

    state: State = {
        localAuthorities: null
    };

    render() {
        let dropdown = null;
        if (this.state.localAuthorities === null) {
            dropdown = <div>loading...</div>;
        } else {
            dropdown = <select onClick={this.handleClick} onChange={this.handleClick} data-testid="authorities_select">
                {this.state.localAuthorities.map((localAuthority: LocalAuthority, i: number) =>
                    <option key={i} value={localAuthority.localAuthorityId} data-testid="authorities_option">{localAuthority.name}</option>
                )}
            </select>;
        }
        return (
            <div className="Authority">
                {dropdown}
            </div>
        );
    }

    handleClick = (event: React.FormEvent<HTMLSelectElement>) => {
        const target = event.currentTarget;
        if (target) {
            this.props.onClick(parseInt(target.value));
        }
    };

    componentDidMount() {
        fetchLocalAuthoritiesJson()
            .then((localAuthorities: LocalAuthority[]) => this.setState({ localAuthorities }));
    }

}
