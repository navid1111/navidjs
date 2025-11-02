import { TEXT_ELEMENT } from "./element.js";

function isEvent(key) {
  return key.startsWith("on");
}

function isProperty(key) {
  return key !== "children" && !isEvent(key);
}

export function createDom(fiber) {
  const dom =
    fiber.type === TEXT_ELEMENT
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}

export function updateDom(dom, prevProps, nextProps) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      if (!nextProps[name] || prevProps[name] !== nextProps[name]) {
        dom.removeEventListener(eventType, prevProps[name]);
      }
    });

  // Remove old properties that does not exist anymore
  Object.keys(prevProps)
    .filter(isProperty)
    .forEach(name => {
      if (!(name in nextProps)) {
        dom[name] = "";
      }
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach(name => {
      if (prevProps[name] !== nextProps[name]) {
        dom[name] = nextProps[name];
      }
    });

  // Add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      if (prevProps[name] !== nextProps[name]) {
        dom.addEventListener(eventType, nextProps[name]);
      }
    });
}
