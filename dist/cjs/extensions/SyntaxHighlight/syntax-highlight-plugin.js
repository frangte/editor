"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
const runmode_node_1 = __importDefault(require("codemirror/addon/runmode/runmode.node"));
require("codemirror/mode/meta");
require("codemirror/mode/python/python");
require("codemirror/mode/stex/stex");
let view;
const modeImports = new Set();
const highlightedNodes = ["mathblock", "codeblock"];
function getDecorations(nodePositions, pluginOptions) {
    const decorations = [];
    nodePositions.forEach(nodePos => {
        const { node, pos } = nodePos;
        const lang = node.attrs.lang;
        const text = node.textContent;
        const mode = runmode_node_1.default.findModeByName(lang) || runmode_node_1.default.findModeByFileName(lang) || runmode_node_1.default.findModeByExtension(lang);
        mode && !runmode_node_1.default.modes[mode.mode] && modeImports.add(mode.mode);
        let startOfLine = pos + 1;
        let currentLine = 0;
        const linesOfText = text.split("\n");
        const getTokens = (text, style, lineNumber, start, state) => {
            if (text === "\n") {
                startOfLine += linesOfText[currentLine++].length + 1;
                return;
            }
            const tokenClass = style && "cm-" + style.replace(/ +/g, " cm-");
            tokenClass && decorations.push(prosemirror_view_1.Decoration.inline(startOfLine + start, startOfLine + start + text.length, { class: tokenClass }));
        };
        const modeSpec = node.type.name === "mathblock" ? { name: "stex" } : (mode ? mode.mode : null);
        runmode_node_1.default.runMode(text, modeSpec, getTokens, {});
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
                decorations.push(prosemirror_view_1.Decoration.widget(startOfLine, lineNumberSpan(index), { side: -1 }));
                startOfLine += line.length + 1;
                index++;
            });
        }
    });
    const modes = Array.from(modeImports);
    if (view !== null && modes.length !== 0) {
        modeImports.clear();
        Promise.all(modes.map(mode => Promise.resolve().then(() => __importStar(require(`codemirror/mode/${mode}/${mode}.js`))))).then(() => {
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
function SyntaxHighlightPlugin(pluginOptions) {
    return new prosemirror_state_1.Plugin({
        state: {
            init: (config, state) => {
                const codeblocks = [];
                const reduceCodeblocks = (node, pos) => { highlightedNodes.includes(node.type.name) && codeblocks.push({ node, pos }); return node.isBlock; };
                state.doc.descendants(reduceCodeblocks);
                return prosemirror_view_1.DecorationSet.create(state.doc, getDecorations(codeblocks, pluginOptions));
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
exports.default = SyntaxHighlightPlugin;
;
