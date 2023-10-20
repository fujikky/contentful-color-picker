import { fireEvent, render } from "@testing-library/react";

import { mockFieldSdk } from "../../test/mocks";

import Field from "./Field";

jest.mock("@contentful/react-apps-toolkit", () => ({
  useSDK: () => mockFieldSdk,
}));

describe("Field component", () => {
  beforeEach(() => {
    mockFieldSdk.field.onValueChanged.mockReturnValue(() => {});
  });

  it("should read a value from field.getValue() and subscribe for external changes", () => {
    mockFieldSdk.field.getValue.mockImplementation(() => "#ff0000");
    const { getByTestId } = render(<Field />);

    expect(mockFieldSdk.field.getValue).toHaveBeenCalled();
    expect(mockFieldSdk.field.onValueChanged).toHaveBeenCalled();
    expect((getByTestId("my-field") as HTMLInputElement).value).toBe("#ff0000");
  });

  it("should call starstartAutoResizer", () => {
    render(<Field />);
    expect(mockFieldSdk.window.startAutoResizer).toHaveBeenCalled();
  });

  it("should call setValue on every change in input", () => {
    const { getByTestId } = render(<Field />);

    fireEvent.change(getByTestId("my-field"), {
      target: { value: "#00ff00" },
    });
    fireEvent.blur(getByTestId("my-field"));

    expect(mockFieldSdk.field.setInvalid).toHaveBeenCalledWith(false);
    expect(mockFieldSdk.field.setValue).toHaveBeenCalledWith("#00ff00");
  });

  it("should call setValue and call setInvalid with true when empty value passed", () => {
    const { getByTestId } = render(<Field />);

    fireEvent.change(getByTestId("my-field"), {
      target: { value: "invalid-value" },
    });
    fireEvent.blur(getByTestId("my-field"));

    expect(mockFieldSdk.field.setInvalid).toHaveBeenCalledWith(true);
    expect(mockFieldSdk.field.setValue).toHaveBeenCalledWith("invalid-value");
  });
});
