import { render, screen } from "@testing-library/react";
import { Authorities } from "../Authorities";
import { RenderWithStore } from "./util";

describe("Authorities", () => {

    it("Shows loading... text before fetch data", () => {
        render(
            <RenderWithStore>
                <Authorities 
                    onClick={ () => { throw new Error() } }
                />
            </RenderWithStore>                
        );
        screen.getByText("loading...");
    });

});