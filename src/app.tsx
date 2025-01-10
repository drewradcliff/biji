import { createRoot } from "react-dom/client";
import Prompt from "./components/propmt";

const root = createRoot(document.body);
root.render(
  <h2>
    Hello from React!
    <Prompt />
  </h2>
);
