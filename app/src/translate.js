import { cloneElement, isValidElement } from "react";

// Props whose text is shown to the reader and therefore needs translating.
const TEXT_PROPS = ["title"];

const hasLetters = (text) => /\p{L}/u.test(text);

function translateText(text, dict) {
  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const translated = dict[match[2]];
  return translated ? match[1] + translated + match[3] : text;
}

// Walk a piece of guide content and swap every piece of text for its translation.
// Text with no translation is left in English.
export function translateTree(node, dict) {
  if (!dict) return node;
  if (typeof node === "string") return translateText(node, dict);
  if (Array.isArray(node)) return node.map((child) => translateTree(child, dict));
  if (!isValidElement(node)) return node;

  const props = {};
  for (const name of TEXT_PROPS) {
    if (typeof node.props[name] === "string") props[name] = translateText(node.props[name], dict);
  }
  const { children } = node.props;
  if (children === undefined) return cloneElement(node, props);
  const translated = Array.isArray(children)
    ? children.map((child) => translateTree(child, dict))
    : [translateTree(children, dict)];
  return cloneElement(node, props, ...translated);
}

// List every piece of translatable text in a piece of guide content, in reading order.
export function collectStrings(node, out = []) {
  if (typeof node === "string") {
    const text = node.trim();
    if (hasLetters(text)) out.push(text);
  } else if (Array.isArray(node)) {
    node.forEach((child) => collectStrings(child, out));
  } else if (isValidElement(node)) {
    for (const name of TEXT_PROPS) {
      if (typeof node.props[name] === "string") out.push(node.props[name].trim());
    }
    collectStrings(node.props.children, out);
  }
  return out;
}
