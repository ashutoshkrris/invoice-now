import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

// Stub static SVG frameworks out completely
vi.mock("../Icons", () => ({
  Icons: {
    AppLogo: () => <span data-testid="mock-logo">Logo</span>,
    Sun: () => <span data-testid="icon-sun">Sun</span>,
    Moon: () => <span data-testid="icon-moon">Moon</span>,
  },
}));

describe("Navbar Component", () => {
  const defaultProps = {
    theme: "light",
    onThemeToggle: vi.fn(),
  };

  const renderNavbar = (initialPath = "/", props = defaultProps) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar {...props} />
      </MemoryRouter>
    );
  };

  it("renders the primary application logo descriptor brand fields", () => {
    renderNavbar();
    expect(screen.getByText("Invoice Now")).toBeInTheDocument();
  });

  it("highlights the currently active navigation route using distinct class weights", () => {
    renderNavbar("/about");

    // Fetch all matching links named "About" across both viewport trees
    const aboutLinks = screen.getAllByRole("link", { name: "About" });

    // Assert on the desktop menu instance (the first matched element)
    expect(aboutLinks[0]).toHaveClass("text-brand-600");
  });

  it("fires theme toggle callbacks immediately upon light/dark theme switch events", () => {
    const handleToggle = vi.fn();
    renderNavbar("/", { ...defaultProps, onThemeToggle: handleToggle });

    const themeBtn = screen.getByTitle("Switch to Dark Mode");
    fireEvent.click(themeBtn);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("toggles the responsive overlay mobile menu drawer component view layout", () => {
    renderNavbar();

    const drawer = screen.getByTestId("mobile-drawer");
    expect(drawer).toHaveClass("invisible");

    // Open Drawer via button trigger selection
    const toggleBtn = screen.getByRole("button", { name: /toggle navigation menu/i });
    fireEvent.click(toggleBtn);

    expect(drawer).toHaveClass("visible");
  });
});
