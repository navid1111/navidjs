import { createElement } from "../core/didact.js";

export default function App(props) {
  // Use createElement directly to avoid JSX setup
  return createElement(
    "div",
    { style: "font-family: Arial, Helvetica, sans-serif; padding: 12px;" },
    createElement("h1", null, "Hi ", props.name),
    createElement("p", null, "This is a small Didact-style demo.")
  );
}
