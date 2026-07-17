import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Footer from "./Footer";

// Stub out icon fragments cleanly
vi.mock("../Icons", () => ({
  Icons: {
    Github: () => <span data-testid="mock-github">GitHub</span>,
    Heart: () => <span data-testid="mock-heart">♥</span>,
  },
}));

describe("Footer Component", () => {
  const renderFooter = () => {
    return render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
  };

  it("renders branding title and application baseline parameters accurately", () => {
    renderFooter();
    // Switched to a robust Regex matcher to ignore formatting whitespaces
    expect(
      screen.getByText(
        /privacy-first invoice generator built for freelancers and small businesses/i
      )
    ).toBeInTheDocument();
  });

  it("renders all core navigation links with correct href parameters", () => {
    renderFooter();

    expect(screen.getByRole("link", { name: "Invoice Builder" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About Us" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy-policy"
    );
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms-of-use"
    );
  });

  it("points open-source external repository links to correct targets", () => {
    renderFooter();

    const githubLink = screen.getByTitle("View source code on GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/ashutoshkrris/invoice-now");
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("contains developer attribution profile anchor routing configurations", () => {
    renderFooter();

    const creditsAnchor = screen.getByRole("link", { name: "Ashutosh Krishna" });
    expect(creditsAnchor).toHaveAttribute("href", "https://ashutoshkrris.in");
  });
});
