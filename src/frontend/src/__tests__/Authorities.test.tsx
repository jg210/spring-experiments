import { render, screen } from "@testing-library/react";
import { Authorities } from "../Authorities";
import { createStore } from "../store";
import { Provider } from "react-redux";

describe("Authorities", () => {

    it("Shows loading... text before fetch data", () => {
        const store = createStore();
        render(
            <Provider store={store}>
                <Authorities onClick={ () => { throw new Error() }} />
            </Provider>
        );
        screen.getByText("loading...");
    });

});