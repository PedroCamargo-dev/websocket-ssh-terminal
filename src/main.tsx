import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from "./Login";
import { TerminalSSH } from "./Terminal";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/terminal" element={<TerminalSSH />} />
    </Routes>
  </BrowserRouter>
);
