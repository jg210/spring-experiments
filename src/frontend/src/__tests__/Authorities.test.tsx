import { render, screen } from "@testing-library/react";
import { Authorities } from "../Authorities";

describe("Authorities", () => {

    it("Shows loading... text before fetch data", () => {
        render(<Authorities onClick={ () => { throw new Error(); }} />);
        screen.getByText("loading...");
    });

});