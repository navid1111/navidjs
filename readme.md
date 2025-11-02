
````markdown
# Mini React Library

This is a simple implementation of a React-like library using **Fibers**. It demonstrates how React performs **reconciliation** and incremental updates to the DOM.

---

## Table of Contents
1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [File Structure](#file-structure)
4. [Step-by-Step Flow](#step-by-step-flow)
5. [Fiber Tree Structure](#fiber-tree-structure)
6. [Effect Tags](#effect-tags)
7. [How to Run](#how-to-run)

---

## Overview

The library allows you to:
- Create elements (like JSX)
- Render them to the DOM
- Update the DOM efficiently by comparing new elements with old ones (reconciliation)
- Support function components

It mimics the basic behavior of React’s rendering and Fiber architecture.

---

## Core Concepts

1. **Element**  
   An element is an object with:
   ```js
   {
     type: "div" | "h1" | FunctionComponent,
     props: {
       ...attributes,
       children: [...]
     }
   }
````

* `type` determines what kind of DOM node or component it is.
* `props` contains attributes and children.
* Children can be strings, numbers, or other elements.

2. **Fiber**
   A Fiber is a unit of work in the library. It contains:

   ```js
   {
     type,
     props,
     dom,       // actual DOM node (for host components)
     parent,
     child,
     sibling,
     alternate, // fiber from previous render
     effectTag  // "UPDATE", "PLACEMENT", "DELETION"
   }
   ```

3. **Effect Tags**
   Effect tags indicate what action should be performed during commit:

   * `UPDATE` → Update existing DOM node
   * `PLACEMENT` → Insert new DOM node
   * `DELETION` → Remove old DOM node

---

## File Structure

| File         | Responsibility                                                                        |
| ------------ | ------------------------------------------------------------------------------------- |
| `index.js`   | Entry point; creates elements and calls `render()`                                    |
| `element.js` | Contains `createElement` and `createTextElement`                                      |
| `dom.js`     | Creates DOM nodes and updates them (`createDom`, `updateDom`)                         |
| `fiber.js`   | Handles fiber traversal and reconciliation (`performUnitOfWork`, `reconcileChildren`) |
| `render.js`  | Sets up root fiber, triggers work loop, and handles commit phase                      |

---

## Step-by-Step Flow

1. **Create Elements**

   * Use `createElement()` to create a virtual DOM tree.

2. **Render Root**

   ```js
   render(element, container)
   ```

   * Creates `wipRoot` (work-in-progress root fiber)
   * Sets `nextUnitOfWork` = `wipRoot`
   * `alternate` is null on the first render

3. **Work Loop**

   * Triggered by `requestIdleCallback` or fallback `setTimeout`
   * While `nextUnitOfWork` exists, `performUnitOfWork(nextUnitOfWork)` is called
   * Returns the next unit of work (child → sibling → parent chain)

4. **Perform Unit of Work**

   * Check if fiber is **function component** or **host component**
   * Function component → call `updateFunctionComponent(fiber)` → children extracted → `reconcileChildren()`
   * Host component → `updateHostComponent(fiber)` → `createDom()` if needed → `reconcileChildren()`

5. **Reconcile Children**

   * Compare new elements with old fibers (from `alternate`)
   * Assign `effectTag` based on comparison:

     * Same type → `UPDATE`
     * New element → `PLACEMENT`
     * Old element removed → `DELETION`
   * Link children and siblings

6. **Commit Phase**

   ```js
   commitRoot()
   ```

   * Triggered when `nextUnitOfWork` = null
   * Calls `commitWork(fiber)` recursively
   * Applies changes to DOM according to `effectTag`

---

## Fiber Tree Structure Example

JSX:

```jsx
<App>
  <h1 title="hello">Hello</h1>
  <p>World</p>
</App>
```

Fiber Tree:

```
FiberRoot (div#root)
└─ child: AppFiber (function)
     ├─ child: H1Fiber (h1)
     │     └─ sibling: P_Fiber (p)
     └─ sibling: null
```

* Child → first child fiber
* Sibling → next sibling fiber
* Parent → parent fiber
* DOM nodes exist only for host components (`h1`, `p`)

---

## How to Run

1. Include all JS files in your project: `index.js`, `element.js`, `dom.js`, `fiber.js`, `render.js`.
2. Create elements:

```js
const element = createElement("h1", { title: "hello" }, "Hello World");
```

3. Render to container:

```js
const container = document.getElementById("root");
render(element, container);
```

4. Browser idle triggers fiber work loop → updates DOM incrementally.

---

## Notes

* This library prioritizes **simplicity over performance**
* Text nodes are wrapped with `TEXT_ELEMENT` for uniform processing
* Fiber tree allows **interruptible rendering**, similar to React’s concurrent mode





