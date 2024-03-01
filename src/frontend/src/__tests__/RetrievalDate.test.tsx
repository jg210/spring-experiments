import { render, screen } from "@testing-library/react";
import { RenderWithStore } from "./util";
import { RetrievalDate } from "../RetrievalDate";
import userEvent from "@testing-library/user-event";

describe("RetrievalDate component", () => {

  it("shows retrieval date", () => {
    const epoch = new Date();
    const onTripleClick = vi.fn();
    render(<RenderWithStore><RetrievalDate epoch={epoch} onTripleClick={onTripleClick} /></RenderWithStore>);
    const retrievalDate = screen.getByTestId("retrieved");
    expect(retrievalDate).toHaveTextContent(`retrieved ${epoch.toLocaleString()}`);
    expect(retrievalDate).toHaveClass("retrieved");
    expect(onTripleClick).toHaveBeenCalledTimes(0);
  });

  it("triple click", async () => {
    const epoch = new Date();
    const onTripleClick = vi.fn();
    render(
      <RenderWithStore>
        <RetrievalDate
          epoch={epoch}
          onTripleClick={onTripleClick}
        />
      </RenderWithStore>
    );
    expect(screen.getByTestId("retrieved")).toHaveTextContent(`retrieved ${epoch.toLocaleString()}`);
    const user = userEvent.setup();
    const retrievedElement = screen.getByTestId("retrieved");
    await user.tripleClick(retrievedElement);
    expect(onTripleClick).toHaveBeenCalledOnce();
  });

});