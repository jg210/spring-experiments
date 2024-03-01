import { useState } from 'react';
import './App.css';
import { Authorities } from './Authorities';
import { Table } from './Table';
import CookieConsent from 'react-cookie-consent';

export const App  = () => {
    const [ localAuthorityId, setLocalAuthorityId ] = useState<number|null>(null);
    return (
        <>
            <div className="app">
                <header className="app-header">
                    <h1 title={__SENTRY_RELEASE__} className="app-title">FSA Food Hygiene Ratings</h1>
                </header>
                <div data-testid="blurb" className="app-blurb">
                    <p>The information provided here is based on data from the Food Standards Agency UK Food Hygiene Rating Data <a href="https://ratings.food.gov.uk">API</a>.</p>
                    <p><a href="https://www.food.gov.uk/terms-and-conditions">https://www.food.gov.uk/terms-and-conditions</a></p>
                </div>
                <Authorities
                    onClick={setLocalAuthorityId}
                />
                { localAuthorityId != null && <Table
                    localAuthorityId={localAuthorityId}
                /> }
            </div>
            <CookieConsent>This site uses cookies. It sends analytics and crash reports to <a className="cookie-consent-link" href="https://sentry.io">sentry</a>.</CookieConsent>
        </>
    );
};
