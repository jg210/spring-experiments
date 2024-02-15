import {
    LocalAuthority,
    RATINGS_REFRESH_INTERVAL_SECONDS,
    useGetLocalAuthoritiesQuery
} from './FSA';

interface AuthoritiesProps {
    onClick: (localAuthorityId: number) => void
}

// Drop down list that populates itself with list of local authorities.
export const Authorities  = (props: AuthoritiesProps) => {

    const { currentData } = useGetLocalAuthoritiesQuery(undefined, {
        pollingInterval: RATINGS_REFRESH_INTERVAL_SECONDS * 1000,
        refetchOnMountOrArgChange: RATINGS_REFRESH_INTERVAL_SECONDS
    });

    const handleClick = (event: React.FormEvent<HTMLSelectElement>) => {
        const target = event.currentTarget;
        if (target) {
            props.onClick(parseInt(target.value));
        }
    };

    const dropdown = (currentData == undefined) ?
        <div data-testid="authorities_loading">loading...</div> :
        <select onClick={handleClick} onChange={handleClick} data-testid="authorities_select">
            {currentData.map((localAuthority: LocalAuthority, i: number) =>
                <option key={i} value={localAuthority.localAuthorityId} data-testid="authorities_option">{localAuthority.name}</option>
            )}
        </select>;

    return (
        <div className="Authority">
            {dropdown}
        </div>
    );

};
