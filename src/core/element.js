export const TEXT_ELEMENT = "TEXT_ELEMENT";
// We use the spread operator for the props and the rest parameter syntax for the children
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...(props || {}),
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

export function createTextElement(text) {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}





// How the element tree will look like




// {
//   type: "div",
//   props: {
//     children: [
//       {
//         type: "TEXT_ELEMENT",
//         props: { nodeValue: "Hello", children: [] }
//       },
//       {
//         type: "span",
//         props: {
//           children: [
//             {
//               type: "TEXT_ELEMENT",
//               props: { nodeValue: "World", children: [] }
//             }
//           ]
//         }
//       }
//     ]
//   }
// }
