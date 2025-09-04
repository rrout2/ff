import React from "react";
import { createRoot } from "react-dom/client";
import SitePage from "./SitePage.jsx"; // <-- your weekly site page
import "./site.css";


createRoot(document.getElementById("root")).render(<SitePage />);
