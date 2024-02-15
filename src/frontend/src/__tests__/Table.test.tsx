import { Table } from "../Table";
import { render, screen } from "@testing-library/react";
import { RenderWithStore } from "./util";

describe("Table component", () => {

  it("shows loading...", () => {
    const localAuthorityId = 342748;
    render(<RenderWithStore><Table localAuthorityId={localAuthorityId} /></RenderWithStore>);
    const loadingElement = screen.getByTestId("table_loading");
    expect(loadingElement).toHaveTextContent("loading...");
  });

});