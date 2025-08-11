import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import KanbanBoard from "./kanbanBoard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KanbanBoard />
  </StrictMode>
);
