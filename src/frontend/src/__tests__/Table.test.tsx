import { Table } from "../Table";
import { render, screen } from "@testing-library/react";

describe("Table component", () => {

  it("renders nothing if id is null", () => {
      const { container } = render(<Table localAuthorityId={null} />);
      expect(container).toBeEmptyDOMElement();
  });

  it("shows loading...", () => {
    const localAuthorityId = 342748;
    render(<Table localAuthorityId={localAuthorityId} />);
    const loadingElement = screen.getByTestId("table_loading");
    expect(loadingElement).toHaveTextContent("loading...");
  });

  it("rerenders nothing if change id to null", () => {
    const localAuthorityId = 342748;
    const { container, rerender } = render(<Table localAuthorityId={localAuthorityId} />);
    const loadingElement = screen.getByTestId("table_loading");
    expect(loadingElement).toHaveTextContent("loading...");
    rerender(<Table localAuthorityId={null}/>);
    expect(container).toBeEmptyDOMElement();
  });

});