import { render, screen } from "@testing-library/react";
import { RenderWithStore } from "./util";
import { RetrievalDate } from "../RetrievalDate";

describe("RetrievalDate component", () => {

  it("shows retrieval date", () => {
    const epoch = new Date();
    render(<RenderWithStore><RetrievalDate epochMillis={epoch.getTime()} /></RenderWithStore>);
    expect(screen.getByTestId("retrieved")).toHaveTextContent(`retrieved ${epoch.toLocaleString()}`);
  });

});