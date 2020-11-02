import { Plugin } from "prosemirror-state"
import type { Transaction } from "prosemirror-state"
import type { Node as PMNode } from "prosemirror-model"
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'

import CodeMirror from 'codemirror/addon/runmode/runmode.node';
import 'codemirror/mode/meta';
import 'codemirror/mode/python/python';
import 'codemirror/mode/stex/stex';

/*
 * Global set of CodeMirror languages to dynamically import.
 */
let view: EditorView;
const modeImports: Set<string> = new Set();

type NodePos = {node: PMNode, pos: number}

const highlightedNodes = ["mathblock", "codeblock"]

/*
 * Computes syntax highlight decorations for nodes.
 * @nodes: list of [node, pos]
 */
function getDecorations(nodePositions: NodePos[], pluginOptions): Decoration[] {
  const decorations: Decoration[] = []
  nodePositions.forEach(nodePos => {
    const { node, pos } = nodePos

    const lang = node.attrs.lang;
    const text = node.textContent;
    // console.log("lang", node, lang)
    const mode = CodeMirror.findModeByName(lang) || CodeMirror.findModeByFileName(lang) || CodeMirror.findModeByExtension(lang)
    mode && !CodeMirror.modes[mode.mode] && modeImports.add(mode.mode)

    let startOfLine: number = pos + 1;
    let currentLine: number = 0;
    const linesOfText: string[] = text.split("\n")

    const getTokens = (text: string, style, lineNumber: number, start: number, state): void => { 
      // CodeMirror runmode returns only newlines \n instead of return carriages \r\n.
      if (text === "\n") { startOfLine += linesOfText[currentLine++].length + 1; return; }
      const tokenClass = style && "cm-" + style.replace(/ +/g, " cm-")
      tokenClass && decorations.push(Decoration.inline(startOfLine + start, startOfLine + start + text.length, {class: tokenClass}))
    }

    // console.log("runmode", modeImports)
    const modeSpec = node.type.name === "mathblock" ?  {name: "stex"} : (mode ? mode.mode : null);
    // console.log("modespec", modeSpec, mode, decorations)
    CodeMirror.runMode(text, modeSpec, getTokens, {});

    if (node.attrs.lineNumbers) {

      let index: number = 1;
      const lineNumberSpan = (index: number) => (): HTMLElement => {
        const span = document.createElement("span")
        span.className = "cm-linenumber";
        span.innerText = index + "";
        return span;
      }
  
      let startOfLine: number = pos + 1;
      const lines = text.split("\n");
      lines.forEach(line => {
        decorations.push(Decoration.widget(startOfLine, lineNumberSpan(index), {side: -1}));
        startOfLine += line.length + 1
        index++
      })
    }

  });

  const modes = Array.from(modeImports)
  if (view !== null && modes.length !== 0) {
    // console.log("null", modeImports)
    modeImports.clear()
    Promise.all(modes.map(mode => import(`codemirror/mode/${mode}/${mode}.js`))).then(() => {
      // console.log(view.state.tr, modes, modeImports)
      view.dispatch(view.state.tr.setMeta("syntaxhighlight", modes))
    })
  }
  return decorations;
}

/**
 * Computes which nodes have been modified by this transaction.
 * https://discuss.prosemirror.net/t/how-to-update-multiple-inline-decorations-on-node-change/1493
 * @param {String} tr
 * @returns {match}
 */
function modifiedCodeblocks(tr: Transaction): NodePos[] {

  let positions: number[] = [];
  tr.mapping.maps.forEach(stepMap => {
    positions = positions.map(r => stepMap.map(r));
    stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => positions.push(newStart, newEnd))
  })

  // Use node as key since a single node can be modified more than once.
  const modified: Map<PMNode, NodePos> = new Map()
  const reduce = (node, pos) => { highlightedNodes.includes(node.type.name) && modified.set(pos, {node, pos}); return node.isBlock }

  for (let i = 0; i < positions.length; i+= 2) {
    const from = positions[i], to = positions[i + 1];
    tr.doc.nodesBetween(from + 1, to, reduce);
  }

  const imported = tr.getMeta("syntaxhighlight")
  if (imported === undefined) return Array.from(modified.values())

  const reduceImported = (node, pos) => { highlightedNodes.includes(node.type.name) && imported.includes(node.attrs.lang) && modified.set(pos, {node, pos}); return node.isBlock }
  tr.doc.descendants(reduceImported)
  return Array.from(modified.values());
}

export default function SyntaxHighlightPlugin(pluginOptions?) {
  return new Plugin({
    state: {
      init: (config, state) => {
        const codeblocks: NodePos[] = []
        const reduceCodeblocks = (node, pos) => { highlightedNodes.includes(node.type.name) && codeblocks.push({node, pos}); return node.isBlock }
        state.doc.descendants(reduceCodeblocks)
        return DecorationSet.create(state.doc, getDecorations(codeblocks, pluginOptions));
      },
      apply: (tr: Transaction, decorationSet) => {
        // Keep old decorationSet if no change in document or no imported languages.
        const imported = tr.getMeta("syntaxhighlight")
        if (tr.docChanged === false && imported === undefined) return decorationSet

        decorationSet = decorationSet.map(tr.mapping, tr.doc)
        
        // Push codeblocks which have been modified on this transaction.
        const modified = modifiedCodeblocks(tr);
        if (modified.length === 0) return decorationSet

        // Cache decorations in unmodified nodes and update decorations in modified nodes.
        const decorationOld = modified.map(item => decorationSet.find(item.pos, item.pos + item.node.nodeSize)).flat();
        decorationSet = decorationSet.remove(decorationOld)
        decorationSet = decorationSet.add(tr.doc, getDecorations(modified, pluginOptions));
        return decorationSet
      },
    },
    props: {
      decorations(state) { return this.getState(state) },
    },
    view(editorView) { 
      // console.log("view init")
      view = editorView;
      return {}
    }
  })
};