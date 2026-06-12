import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/elegant.css";
import "./styles/floral.css";
import "./styles/luxury.css";
import "./styles/modern.css";
import "./styles/aurora.css";
import "./styles/royal.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
