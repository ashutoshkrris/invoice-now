import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExportMenu from "./ExportMenu";

// Mock the Icons component so we aren't dependent on SVG raw layouts during assertion runs
vi.mock("../Icons", () => ({
  Icons: {
    Download: ({ className }) => <span className={className} data-testid="mock-download-icon" />,
    ChevronDown: ({ className }) => <span className={className} data-testid="mock-chevron-icon" />,
    Print: () => <span>Print</span>,
    FileText: () => <span>PDF</span>,
    Image: () => <span>PNG</span>,
  },
}));

describe("ExportMenu Component", () => {
  const defaultProps = {
    onPrint: vi.fn(),
    onExportPNG: vi.fn(),
    onExportPDF: vi.fn(),
    isFloating: false,
  };

  it("renders wide text-based interactive menu option if floating state remains inactive", () => {
    render(<ExportMenu {...defaultProps} />);
    expect(screen.getByText("Export As")).toBeInTheDocument();
    expect(screen.queryByTestId("export-dropdown-panel")).not.toBeInTheDocument();
  });

  it("renders minimal design trigger profile layout when floating state toggle flags are active", () => {
    render(<ExportMenu {...defaultProps} isFloating={true} />);
    expect(screen.queryByText("Export As")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /floating trigger/i })).toBeInTheDocument();
  });

  it("toggles options window panel context visibility states upon trigger button click action", () => {
    render(<ExportMenu {...defaultProps} />);
    const mainButton = screen.getByRole("button", { name: /export invoice trigger/i });

    // Open options
    fireEvent.click(mainButton);
    expect(screen.getByTestId("export-dropdown-panel")).toBeInTheDocument();

    // Close options
    fireEvent.click(mainButton);
    expect(screen.queryByTestId("export-dropdown-panel")).not.toBeInTheDocument();
  });

  it("fires corresponding operations and collapses action panels down when items are clicked", () => {
    const handlePDF = vi.fn();
    render(<ExportMenu {...defaultProps} onExportPDF={handlePDF} />);

    // Expand visibility view
    fireEvent.click(screen.getByRole("button", { name: /export invoice trigger/i }));

    const pdfButton = screen.getByText("Download PDF Document");
    fireEvent.click(pdfButton);

    expect(handlePDF).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("export-dropdown-panel")).not.toBeInTheDocument();
  });

  it("collapses option layouts if document surface areas outside component limits register target click inputs", () => {
    render(<ExportMenu {...defaultProps} />);

    // Open panel visibility overlay
    fireEvent.click(screen.getByRole("button", { name: /export invoice trigger/i }));
    expect(screen.getByTestId("export-dropdown-panel")).toBeInTheDocument();

    // Simulate an external surface window background interaction event
    fireEvent.mouseDown(document.body);

    expect(screen.queryByTestId("export-dropdown-panel")).not.toBeInTheDocument();
  });
});
