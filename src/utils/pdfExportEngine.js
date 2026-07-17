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
    triggerToast("PNG Image generated successfully!");
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

  setTimeout(async () => {
    const target = document.getElementById("printable-invoice-area");
    if (!target) {
      setIsExporting(false);
      return;
    }

    const originalWidth = target.style.width;
    const originalMinHeight = target.style.minHeight;

    target.style.width = BASELINE_WIDTH;
    const singlePageHeight = invoice.paperSize === "letter" ? 1050 : 1120;
    target.style.minHeight = `${singlePageHeight}px`;

    // 1. EVALUATE ELEMENTS & INJECT SPACERS
    const allElements = target.querySelectorAll(
      "p, h1, h2, h3, h4, tr, th, blockquote, .avoid-page-slice"
    );
    const injectedSpacers = [];

    // DEFENSIVE PARAMETER: Reserve 16mm (approx 60px) at the bottom of every page for our footer
    const FOOTER_BUFFER_HEIGHT = 60;

    allElements.forEach((el) => {
      if (el === target || el.contains(target) || el.offsetHeight > singlePageHeight) return;

      const elementTop = el.getBoundingClientRect().top - target.getBoundingClientRect().top;
      // Evaluate content boundary factoring in our required bottom footer buffer space
      const elementBottom = elementTop + el.offsetHeight + FOOTER_BUFFER_HEIGHT;

      const pageOfTop = Math.floor(elementTop / singlePageHeight);
      const pageOfBottom = Math.floor(elementBottom / singlePageHeight);

      if (pageOfTop !== pageOfBottom) {
        const remainingSpaceOnCurrentPage = singlePageHeight * (pageOfTop + 1) - elementTop;
        let globalSpacer;

        if (el.tagName.toLowerCase() === "tr") {
          globalSpacer = document.createElement("tr");
          globalSpacer.className = "injected-pdf-spacer no-print";
          globalSpacer.innerHTML = `<td colspan="100" style="padding:0; border:none;"><div style="height: ${remainingSpaceOnCurrentPage + 4}px;"></div></td>`;
        } else {
          globalSpacer = document.createElement("div");
          globalSpacer.className = "injected-pdf-spacer no-print";
          globalSpacer.style.height = `${remainingSpaceOnCurrentPage + 8}px`;
        }

        el.parentNode.insertBefore(globalSpacer, el);
        injectedSpacers.push(globalSpacer);
      }
    });

    // 2. CAPTURE HIGHFIDELITY SNAPSHOT
    try {
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

      // Calculate total final page count mathematically
      const totalPages = Math.max(1, Math.ceil(totalPdfImgHeight / pdfPageHeight));
      let currentPage = 1;

      // HELPER: Vector drawing function for crisp, un-slipped footer layouts
      const injectNativePDFFooter = (pdfInstance, current, total) => {
        pdfInstance.setFont("helvetica", "normal");
        pdfInstance.setFontSize(8);
        pdfInstance.setTextColor(148, 163, 184); // slate-400 color match

        const marginX = 15; // standard print safety margin
        const positionY = pdfPageHeight - 10; // 10mm from absolute bottom

        // Left Text: Branding / Business Identifier safely fetched from state
        const businessName = invoice.businessName
          ? invoice.businessName.toUpperCase()
          : "Generated for free using Invoice Now";
        pdfInstance.text(businessName, marginX, positionY);

        // Right Text: Accurate dynamic Page Strings
        const pageString = `Page ${current} of ${total}`;
        const stringWidth =
          pdfInstance.getStringUnitWidth(pageString) * (8 / pdfInstance.internal.scaleFactor);
        pdfInstance.text(pageString, pdfWidth - marginX - stringWidth, positionY);

        // Subtle upper divider rule line
        pdfInstance.setDrawColor(241, 245, 249); // slate-100 line match
        pdfInstance.setLineWidth(0.2);
        pdfInstance.line(marginX, positionY - 4, pdfWidth - marginX, positionY - 4);
      };

      // Render Page 1
      pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
      injectNativePDFFooter(pdf, currentPage, totalPages);
      heightLeft -= pdfPageHeight;

      // Slice through remaining canvas blocks sequentially
      while (heightLeft > 0) {
        position = heightLeft - totalPdfImgHeight;
        currentPage++;

        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, pdfWidth, totalPdfImgHeight, undefined, "FAST");
        injectNativePDFFooter(pdf, currentPage, totalPages);
        heightLeft -= pdfPageHeight;
      }

      pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
      triggerToast("PDF document generated successfully!");
    } catch (err) {
      console.error(err);
      triggerToast("PDF generation failed", "error");
    } finally {
      // 3. SAFE RETRACTION CLEANUP
      target.style.width = originalWidth;
      target.style.minHeight = originalMinHeight;
      injectedSpacers.forEach((s) => s.remove());
      setIsExporting(false);
    }
  }, 400);
};
