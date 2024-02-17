import { useState } from 'react';
import './App.css';
import { Authorities } from './Authorities';
import { Table } from './Table';

export const App  = () => {
    const [ localAuthorityId, setLocalAuthorityId ] = useState<number|null>(null);
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">FSA Food Hygiene Ratings</h1>
            </header>
            <div className="App-blurb">
                <p>The information provided here is based on data from the Food Standards Agency UK Food Hygiene Rating Data API.</p>
                <p><a href="https://ratings.food.gov.uk">https://ratings.food.gov.uk</a></p>
                <p><a href="https://www.food.gov.uk/terms-and-conditions">https://www.food.gov.uk/terms-and-conditions</a></p>
            </div>
            <Authorities
                onClick={setLocalAuthorityId}
            />
            { localAuthorityId != null && <Table
                localAuthorityId={localAuthorityId}
            /> }
        </div>
    );
};
