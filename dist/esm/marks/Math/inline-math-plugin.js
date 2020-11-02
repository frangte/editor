import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from 'prosemirror-view';
import katex from "katex";
const INLINE_MATH_REGEX = /(?<=\s|\W|^)\$([^$]+)\$(?=\s|\W|$)/g;
function reduceMatches(matches, nodePos) {
    const { node, pos } = nodePos;
    if (node.isTextblock === false || node.type.spec.code)
        return matches;
    let match = null;
    while (match = INLINE_MATH_REGEX.exec(node.textContent))
        matches.push({ "match": match[1], from: pos + match.index, to: pos + match.index + match[0].length });
    return matches;
}
function reduceMathDecorations(decorations, match) {
    try {
        const html = katex.renderToString(match.match);
        const toDOM = () => { const span = document.createElement("span"); span.innerHTML = html; return span; };
        decorations.push(Decoration.widget(match.from + 1, toDOM));
    }
    catch (error) {
    }
    decorations.push(Decoration.inline(match.from + 1, match.to + 1, { class: "math-content" }));
    return decorations;
}
function modifiedTextblocks(tr) {
    let positions = [];
    tr.mapping.maps.forEach(stepMap => {
        positions = positions.map(r => stepMap.map(r));
        stepMap.forEach((oldStart, oldEnd, newStart, newEnd) => positions.push(newStart, newEnd));
    });
    const textblocks = new Map();
    const reduce = (node, pos) => { node.isTextblock && !node.type.spec.code && textblocks.set(pos, { node, pos }); return node.isBlock && !node.isTextblock; };
    for (let i = 0; i < positions.length; i += 2) {
        let from = positions[i], to = positions[i + 1];
        tr.doc.nodesBetween(from + 1, to, reduce);
    }
    return Array.from(textblocks.values());
}
export default function InlineMathDecorationsPlugin() {
    const pluginKey = new PluginKey("InlineMathPlugin");
    return new Plugin({
        key: pluginKey,
        state: {
            init(config, state) {
                const textblocks = new Map();
                const reduce = (node, pos) => { node.isTextblock && !node.type.spec.code && textblocks.set(pos, { node, pos }); return node.isBlock && !node.isTextblock; };
                state.doc.descendants(reduce);
                const uniqueTextblocks = Array.from(textblocks.values());
                console.log("unique", uniqueTextblocks);
                const matches = uniqueTextblocks.reduce(reduceMatches, []);
                const decorations = matches.reduce(reduceMathDecorations, []);
                return { modified: [], decorations: DecorationSet.create(state.doc, decorations), lastTransaction: null };
            },
            apply(tr, prevState) {
                const prevTr = prevState.lastTransaction;
                prevState.lastTransaction = tr;
                if (tr.docChanged === false)
                    return { ...prevState, modified: [] };
                let prevDecorations = prevState.decorations.map(tr.mapping, tr.doc);
                const modified = modifiedTextblocks(tr);
                if (modified.length === 0)
                    return { ...prevState, modified: [], decorations: prevDecorations };
                const matches = modified.reduce(reduceMatches, []);
                const newDecorations = matches.reduce(reduceMathDecorations, []);
                const oldDecorations = modified.map(nodePos => prevDecorations.find(nodePos.pos, nodePos.pos + nodePos.node.nodeSize)).flat();
                prevDecorations = prevDecorations.remove(oldDecorations);
                prevDecorations = prevDecorations.add(tr.doc, newDecorations);
                return { modified, decorations: prevDecorations };
            }
        },
        props: {
            decorations(state) { return this.getState(state).decorations; }
        },
        appendTransaction(transactions, oldState, newState) {
            const docChanged = transactions.reduce((docChanged, tr) => docChanged || tr.docChanged, false);
            if (docChanged === false)
                return;
            const modified = pluginKey.getState(newState).modified;
            if (modified.length === 0)
                return;
            const matches = modified.reduce(reduceMatches, []);
            let tr = newState.tr;
            modified.forEach(m => (tr = tr.removeMark(m.pos, m.pos + m.node.nodeSize, newState.schema.marks.math)));
            matches.forEach(m => (tr = tr.addMark(m.from + 1, m.to + 1, newState.schema.marks.math.create())));
            return tr;
        }
    });
}
