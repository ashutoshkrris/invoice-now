import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditableField from "./EditableField";

describe("EditableField Component", () => {
  it("renders a native input control by default", () => {
    render(<EditableField value="Test" onChange={() => {}} placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveValue("Test");
  });

  it("renders a textarea element when specified", () => {
    render(
      <EditableField type="textarea" value="Long text" onChange={() => {}} placeholder="Bio" />
    );
    const textarea = screen.getByPlaceholderText("Bio");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
  });

  it("dispatches active changes through onChange events", async () => {
    const handleChange = vi.fn();
    render(<EditableField value="" onChange={handleChange} placeholder="Type stuff" />);

    const input = screen.getByPlaceholderText("Type stuff");
    await userEvent.type(input, "A");

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  describe("Export System Constraints", () => {
    it("returns null entirely if field content is blank during export actions", () => {
      const { container } = render(
        <EditableField isExporting={true} value="" onChange={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it("presents structured plain text node for inputs while exporting", () => {
      render(<EditableField isExporting={true} value="Static Info" onChange={() => {}} />);
      const viewNode = screen.getByTestId("export-input");
      expect(viewNode).toHaveTextContent("Static Info");
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("applies whitespace preserving css properties for custom multi-line textures", () => {
      render(
        <EditableField
          isExporting={true}
          type="textarea"
          value="Line1\nLine2"
          onChange={() => {}}
        />
      );
      const viewNode = screen.getByTestId("export-textarea");
      expect(viewNode).toHaveClass("whitespace-pre-wrap");
    });
  });

  describe("Character Length Warning Thresholds", () => {
    it("hides character counter underneath 90% boundary marks", () => {
      render(<EditableField value="abc" maxLength={10} showCount={true} onChange={() => {}} />);
      expect(screen.queryByTestId("character-counter")).not.toBeInTheDocument();
    });

    it("displays counter metrics if content limits expand past 90%", () => {
      render(
        <EditableField value="123456789" maxLength={10} showCount={true} onChange={() => {}} />
      );
      const counter = screen.getByTestId("character-counter");
      expect(counter).toBeInTheDocument();
      expect(counter).toHaveTextContent("9/10");
      expect(counter).toHaveClass("text-amber-500");
    });

    it("mutates counter highlighting styles once maximum cap parameters are met", () => {
      render(
        <EditableField value="1234567890" maxLength={10} showCount={true} onChange={() => {}} />
      );
      const counter = screen.getByTestId("character-counter");
      expect(counter).toHaveClass("text-rose-500", "font-bold");
    });
  });
});
