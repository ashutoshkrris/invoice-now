import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instantly resets the browser view window back to the absolute top coordinates
    window.scrollTo(0, 0);
  }, [pathname]); // Fires seamlessly every single time the active URL path modifications change

  return null; // This component stays invisible and doesn't render markup
}
