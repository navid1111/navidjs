import { createElement, render } from "./core/didact.js";
import App from "./app/App.js";

const element = createElement(App, { name: "Foo" });
const container = document.getElementById("root");
render(element, container);
