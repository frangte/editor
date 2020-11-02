import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from 'prosemirror-view';
import CodeMirror from 'codemirror/addon/runmode/runmode.node';
import 'codemirror/mode/meta';
import 'codemirror/mode/python/python';
import 'codemirror/mode/stex/stex';
let view;
const modeImports = new Set();
const highlightedNodes = ["mathblock", "codeblock"];
function getDecorations(nodePositions, pluginOptions) {
    const decorations = [];
    nodePositions.forEach(nodePos => {
        const { node, pos } = nodePos;
        const lang = node.attrs.lang;
        const text = node.textContent;
        const mode = CodeMirror.findModeByName(lang) || CodeMirror.findModeByFileName(lang) || CodeMirror.findModeByExtension(lang);
        mode && !CodeMirror.modes[mode.mode] && modeImports.add(mode.mode);
        let startOfLine = pos + 1;
        let currentLine = 0;
        const linesOfText = text.split("\n");
        const getTokens = (text, style, lineNumber, start, state) => {
            if (text === "\n") {
                startOfLine += linesOfText[currentLine++].length + 1;
                return;
            }
            const tokenClass = style && "cm-" + style.replace(/ +/g, " cm-");
            tokenClass && decorations.push(Decoration.inline(startOfLine + start, startOfLine + start + text.length, { class: tokenClass }));
        };
        const modeSpec = node.type.name === "mathblock" ? { name: "stex" } : (mode ? mode.mode : null);
        CodeMirror.runMode(text, modeSpec, getTokens, {});
        if (node.attrs.lineNumbers) {
            let index = 1;
            const lineNumberSpan = (index) => () => {
                const span = document.createElement("span");
                span.className = "cm-linenumber";
                span.innerText = index + "";
                return span;
            };
            let startOfLine = pos + 1;
            const lines = text.split("\n");
            lines.forEach(line => {
                decorations.push(Decoration.widget(startOfLine, lineNumberSpan(index), { side: -1 }));
                startOfLine += line.length + 1;
                index++;
            });
        }
    });
    const modes = Array.from(modeImports);
    if (view !== null && modes.length !== 0) {
        modeImports.clear();
        Promise.all(modes.map(mode => import(`codemirror/mode/${mode}/${mode}.js`))).then(() => {
            view.dispatch(view.state.tr.setMeta("syntaxhighlight", modes));
        });
    }
    return decorations;
}
function modifiedCodeblocks(tr) {
    let positions = [];
    tr.mapping.maps.forEach(stepMap => {
        positions = positions.map(r => stepMap.map(r));
        stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => positions.push(newStart, newEnd));
    });
    const modified = new Map();
    const reduce = (node, pos) => { highlightedNodes.includes(node.type.name) && modified.set(pos, { node, pos }); return node.isBlock; };
    for (let i = 0; i < positions.length; i += 2) {
        const from = positions[i], to = positions[i + 1];
        tr.doc.nodesBetween(from + 1, to, reduce);
    }
    const imported = tr.getMeta("syntaxhighlight");
    if (imported === undefined)
        return Array.from(modified.values());
    const reduceImported = (node, pos) => { highlightedNodes.includes(node.type.name) && imported.includes(node.attrs.lang) && modified.set(pos, { node, pos }); return node.isBlock; };
    tr.doc.descendants(reduceImported);
    return Array.from(modified.values());
}
export default function SyntaxHighlightPlugin(pluginOptions) {
    return new Plugin({
        state: {
            init: (config, state) => {
                const codeblocks = [];
                const reduceCodeblocks = (node, pos) => { highlightedNodes.includes(node.type.name) && codeblocks.push({ node, pos }); return node.isBlock; };
                state.doc.descendants(reduceCodeblocks);
                return DecorationSet.create(state.doc, getDecorations(codeblocks, pluginOptions));
            },
            apply: (tr, decorationSet) => {
                const imported = tr.getMeta("syntaxhighlight");
                if (tr.docChanged === false && imported === undefined)
                    return decorationSet;
                decorationSet = decorationSet.map(tr.mapping, tr.doc);
                const modified = modifiedCodeblocks(tr);
                if (modified.length === 0)
                    return decorationSet;
                const decorationOld = modified.map(item => decorationSet.find(item.pos, item.pos + item.node.nodeSize)).flat();
                decorationSet = decorationSet.remove(decorationOld);
                decorationSet = decorationSet.add(tr.doc, getDecorations(modified, pluginOptions));
                return decorationSet;
            },
        },
        props: {
            decorations(state) { return this.getState(state); },
        },
        view(editorView) {
            view = editorView;
            return {};
        }
    });
}
;
