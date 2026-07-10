import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ScrollToTop from "./components/shared/ScrollToTop"; // Import the behavior hook
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop /> {/* Invisible globally active monitoring trigger hook dropped here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
