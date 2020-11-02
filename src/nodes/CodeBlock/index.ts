
import Node from '../Node'
import { lineIndent, lineUndent, newLine, deleteCodeBlock, toggleLineNumbers } from "./keymaps.js"
import { textblockTypeInputRule } from 'prosemirror-inputrules'
import { setBlockType } from 'prosemirror-commands'
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
import parserules from "./parserules"

export default class CodeBlock extends Node {

  get name() {
    return "codeblock"
  }

  get schema(): NodeSpec {
    return {
      attrs: { lang: { default: "" }, lineNumbers: { default: false }},
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      parseDOM: [...parserules,
        {tag: "pre.codeblock", getAttrs(dom: HTMLDivElement) { return {...dom.dataset}}, preserveWhitespace: "full"}, 
        {tag: "pre", preserveWhitespace: "full"}
      ],
      toDOM(node: PMNode) { return ["pre", {class: "codeblock", ...node.attrs.lang && {"data-lang": node.attrs.lang}}, ["code", {spellcheck: "false"}, 0]] },
    }
  }

  commands({nodeType, schema}) {
    return () => setBlockType(nodeType)
  }

  keys({nodeType}) {
    return {
      "Shift-Ctrl-\\": setBlockType(nodeType),
      "Tab": lineIndent,
      "Shift-Tab": lineUndent,
      "Enter": newLine,
      "Ctrl-l": toggleLineNumbers,
      "Backspace": deleteCodeBlock,
    }
  }

  inputRules({nodeType}) {
    return [
      textblockTypeInputRule(/^```([^\s]*)[\s\n]$/, nodeType, match => ({...match[1] && {lang: match[1]}}))
    ];
  }

  toMarkdown(state, node) {
    state.write("```" + node.attrs.lang + "\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
  }

  get markdownToken() {
    return "fence";
  }

  parseMarkdown() {
    return {
      block: "code_block",
      getAttrs: tok => ({ language: tok.info }),
    };
  }
}