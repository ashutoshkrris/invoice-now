import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const BASELINE_WIDTH = "794px";
const OPTIMIZED_FILTER = (node) => {
  if (node.style) {
    node.style.overflow = "visible";
    node.style.overflowX = "visible";
    node.style.overflowY = "visible";
    if (node.classList?.contains("overflow-x-auto")) {
      node.style.scrollbarWidth = "none";
    }
  }
  if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
    const href = node.getAttribute("href");
    return (
      href &&
      (href.startsWith("/") ||
        href.includes(window.location.host) ||
        href.includes("fonts.googleapis.com"))
    );
  }
  return true;
};

export const runSystemPrint = (invoice, setIsExporting) => {
  setIsExporting(true);
  const target = document.getElementById("printable-invoice-area");
  if (!target) {
    setIsExporting(false);
    return;
  }

  const originalWidth = target.style.width;
  const originalMinHeight = target.style.minHeight;
  target.style.width = BASELINE_WIDTH;
  target.style.minHeight = invoice.paperSize === "letter" ? "1050px" : "1120px";

  setTimeout(() => {
    window.print();
    target.style.width = originalWidth;
    target.style.minHeight = originalMinHeight;
    setIsExporting(false);
  }, 300);
};

export const exportToPNG = async (invoice, setIsExporting, triggerToast) => {
  setIsExporting(true);
  triggerToast("Generating high-res PNG image...", "info");

  const target = document.getElementById("printable-invoice-area");
  if (!target) {
    setIsExporting(false);
    return;
  }

  const originalWidth = target.style.width;
  const originalMinHeight = target.style.minHeight;
  target.style.width = BASELINE_WIDTH;
  target.style.minHeight = invoice.paperSize === "letter" ? "1050px" : "1120px";

  try {
    await new Promise((res) => setTimeout(res, 60));
    const dataUrl = await toPng(target, {
      quality: 0.95,
      pixelRatio: 3,
      backgroundColor: "#ffffff",
      filter: OPTIMIZED_FILTER,
    });

    const link = document.createElement("a");
    link.download = `${invoice.invoiceNumber || "invoice"}.png`;
    link.href = dataUrl;
    link.click();
    triggerToast("PNG Image download complete!");
  } catch (err) {
    console.error(err);
    triggerToast("PNG generation failed", "error");
  } finally {
    target.style.width = originalWidth;
    target.style.minHeight = originalMinHeight;
    setIsExporting(false);
  }
};

export const exportToPDF = async (invoice, setIsExporting, triggerToast) => {
  setIsExporting(true);
  triggerToast("Generating print-quality PDF...", "info");

  // CRITICAL REFACTOR: Re-introduce the lifecycle delay wrapper to allow
  // React state changes and theme styling adjustments to paint to the DOM.
  setTimeout(async () => {
    const target = document.getElementById("printable-invoice-area");
    if (!target) {
      setIsExporting(false);
      return;
    }

    const originalWidth = target.style.width;
    const originalMinHeight = target.style.minHeight;

    // 1. Force layout resize to target print parameters
    target.style.width = BASELINE_WIDTH;
    const singlePageHeight = invoice.paperSize === "letter" ? 1050 : 1120;
    target.style.minHeight = `${singlePageHeight}px`;

    // 2. Query structural components for boundary evaluation now that width is pinned
    const allElements = target.querySelectorAll("p, h1, h2, h3, h4, tr, th, div, blockquote");
    const injectedSpacers = [];

    allElements.forEach((el) => {
      if (el === target || el.contains(target) || el.offsetHeight > singlePageHeight) return;

      const elementTop = el.getBoundingClientRect().top - target.getBoundingClientRect().top;
      const elementBottom = elementTop + el.offsetHeight;
      const pageOfTop = Math.floor(elementTop / singlePageHeight);
      const pageOfBottom = Math.floor(elementBottom / singlePageHeight);

      if (pageOfTop !== pageOfBottom) {
        const remainingSpaceOnCurrentPage = singlePageHeight * (pageOfTop + 1) - elementTop;
        const globalSpacer = document.createElement("div");
        globalSpacer.className = "injected-pdf-spacer no-print";
        globalSpacer.style.height = `${remainingSpaceOnCurrentPage + 8}px`;

        el.parentNode.insertBefore(globalSpacer, el);
        injectedSpacers.push(globalSpacer);
      }
    });

    // 3. Execute Image Capture and PDF Assembly Pipeline
    try {
      // Small structural layout breathing buffer to match working commit
      await new Promise((res) => setTimeout(res, 60));

      const dataUrl = await toPng(target, {
        quality: 0.95,
        pixelRatio: 2.5,
        backgroundColor: "#ffffff",
        filter: OPTIMIZED_FILTER,
      });

      const format = invoice.paperSize === "letter" ? "letter" : "a4";
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const totalPdfImgHeight = pdfWidth * (target.offsetHeight / target.offsetWidth);

      let heightLeft = totalPdfImgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - totalPdfImgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
        heightLeft -= pdfPageHeight;
      }

      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
      triggerToast("PDF document download complete!");
    } catch (err) {
      console.error(err);
      triggerToast("PDF generation failed", "error");
    } finally {
      // 4. Reset DOM to standard workspace properties safely
      target.style.width = originalWidth;
      target.style.minHeight = originalMinHeight;
      injectedSpacers.forEach((s) => s.remove());
      setIsExporting(false);
    }
  }, 400); // Kept the matching 400ms time window from your operational commit
};
