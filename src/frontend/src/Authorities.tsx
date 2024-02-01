import React, { useEffect, useState } from 'react';
import {
    fetchLocalAuthoritiesJson,
    LocalAuthority
} from './FSA';

interface Props {
    onClick: (localAuthorityId: number) => void
}

// Drop down list that populates itself with list of local authorities.
export const Authorities  = (props: Props) => {

    const [ localAuthorities, setLocalAuthorities ] = useState<LocalAuthority[] | null>(null);

    useEffect(() => {
        fetchLocalAuthoritiesJson()
        .then((localAuthorities: LocalAuthority[]) => setLocalAuthorities(localAuthorities));
        // TODO AbortController
    }, []);

    const handleClick = (event: React.FormEvent<HTMLSelectElement>) => {
        const target = event.currentTarget;
        if (target) {
            props.onClick(parseInt(target.value));
        }
    };

    const dropdown = (localAuthorities === null) ?
        <div data-testid="authorities_loading">loading...</div> :
        <select onClick={handleClick} onChange={handleClick} data-testid="authorities_select">
            {localAuthorities.map((localAuthority: LocalAuthority, i: number) =>
                <option key={i} value={localAuthority.localAuthorityId} data-testid="authorities_option">{localAuthority.name}</option>
            )}
        </select>;

    return (
        <div className="Authority">
            {dropdown}
        </div>
    );

};
