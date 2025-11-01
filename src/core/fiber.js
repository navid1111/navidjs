import { createDom } from "./dom.js";

// performUnitOfWork returns the next unit of work (fiber) to process.
export function performUnitOfWork(fiber, deletions) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber, deletions);
  } else {
    updateHostComponent(fiber, deletions);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let next = fiber;
  while (next) {
    if (next.sibling) {
      return next.sibling;
    }
    next = next.parent;
  }
  return null;
}

export function updateFunctionComponent(fiber, deletions) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children, deletions);
}

export function updateHostComponent(fiber, deletions) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children, deletions);
}

export function reconcileChildren(wipFiber, elements, deletions) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
