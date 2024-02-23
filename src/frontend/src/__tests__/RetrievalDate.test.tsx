import { render, screen } from "@testing-library/react";
import { RenderWithStore } from "./util";
import { RetrievalDate } from "../RetrievalDate";
import userEvent from "@testing-library/user-event";

describe("RetrievalDate component", () => {

  it("shows retrieval date", () => {
    const epoch = new Date();
    render(<RenderWithStore><RetrievalDate epochMillis={epoch.getTime()} /></RenderWithStore>);
    expect(screen.getByTestId("retrieved")).toHaveTextContent(`retrieved ${epoch.toLocaleString()}`);
  });

  it("triple click", async () => {
    const epoch = new Date();
    const onTripleClick = vi.fn();
    render(
      <RenderWithStore>
        <RetrievalDate
          epochMillis={epoch.getTime()}
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