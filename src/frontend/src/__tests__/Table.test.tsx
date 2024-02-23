import { Table, onRetrievalDateTripleClick } from "../Table";
import { render, screen } from "@testing-library/react";
import { RenderWithStore } from "./util";

describe("Table component", () => {

  it("shows loading...", () => {
    const localAuthorityId = 342748;
    render(<RenderWithStore><Table localAuthorityId={localAuthorityId} /></RenderWithStore>);
    const loadingElement = screen.getByTestId("table_loading");
    expect(loadingElement).toHaveTextContent("loading...");
  });

  it("handles triple click with crash test", () => {
    expect(onRetrievalDateTripleClick).toThrowError(new Error("crash test"));
  });

});