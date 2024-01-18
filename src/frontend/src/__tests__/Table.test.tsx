import { Table } from "../Table";
import { render } from "@testing-library/react";

describe("Table component", () => {

  it("renders nothing if id is null", () => {
      const { container } = render(<Table localAuthorityId={null} />);
      expect(container.firstChild).toBeNull();
  });

});