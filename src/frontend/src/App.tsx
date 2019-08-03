import React, { Component } from 'react';
import './App.css';
import { Authorities } from './Authorities';
import { Table } from './Table';

interface Props {
}

interface State {
    localAuthorityId: number | null
}

class App extends Component<Props,State> {

    state: State = {
        localAuthorityId: null
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">FSA Food Hygiene Ratings</h1>
                </header>
                <div>
                    <p>The information provided here is based on data from the Food Standards Agency UK Food Hygiene Rating Data API.</p>
                    <p><a href="https://ratings.food.gov.uk/">https://ratings.food.gov.uk</a></p>
                    <p><a href="https://www.food.gov.uk/terms-and-conditions">https://www.food.gov.uk/terms-and-conditions</a></p>
                </div>
                <Authorities
                    onClick={this.handleLocalAuthorityClick}
                />
                <Table
                    localAuthorityId={this.state.localAuthorityId}
                />
            </div>
        );
    }

    handleLocalAuthorityClick = (localAuthorityId: number): void => {
        this.setState({ localAuthorityId });
    }

}

export default App;
