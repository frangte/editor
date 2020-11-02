"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleLineNumbers = exports.deleteCodeBlock = exports.newLine = exports.lineUndent = exports.lineIndent = void 0;
function lineIndent(state, dispatch, view) {
    if (!isSelectionEntirelyInsideCodeBlock(state))
        return false;
    return indent(state, dispatch);
}
exports.lineIndent = lineIndent;
function lineUndent(state, dispatch, view) {
    if (!isSelectionEntirelyInsideCodeBlock(state))
        return false;
    return undent(state, dispatch);
}
exports.lineUndent = lineUndent;
function newLine(state, dispatch, view) {
    if (!isSelectionEntirelyInsideCodeBlock(state))
        return false;
    return insertNewlineWithIndent(state, dispatch);
}
exports.newLine = newLine;
function deleteCodeBlock(state, dispatch, view) {
    if (!isSelectionEntirelyInsideCodeBlock(state))
        return false;
    if (!state.selection.$cursor || (state.selection.$cursor && state.selection.$cursor.node().textContent))
        return false;
    const { tr, selection } = state;
    tr.deleteRange(selection.$cursor.before(selection.$cursor.depth), selection.$cursor.end(selection.$cursor.depth) + 1);
    dispatch(tr);
    return true;
}
exports.deleteCodeBlock = deleteCodeBlock;
function getIndentLevel(indentText, indentSize) {
    return (indentSize && indentText.length) ? indentText.length / indentSize : 0;
}
const prosemirror_state_1 = require("prosemirror-state");
function indent(state, dispatch) {
    const { text, start } = getLinesFromSelection(state);
    const { tr, selection } = state;
    forEachLine(text, (line, offset) => {
        const { indentText, indentToken } = getLineInfo(line);
        const indentLevel = getIndentLevel(indentText, indentToken.size);
        const indentToAdd = indentToken.token.repeat(indentToken.size - (indentText.length % indentToken.size) || indentToken.size);
        tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));
        if (!selection.empty) {
            tr.setSelection(prosemirror_state_1.TextSelection.create(tr.doc, tr.mapping.map(selection.from, -1), tr.selection.to));
        }
    });
    if (dispatch) {
        dispatch(tr);
    }
    return true;
}
function undent(state, dispatch) {
    const { text, start } = getLinesFromSelection(state);
    const { tr } = state;
    forEachLine(text, (line, offset) => {
        const { indentText, indentToken } = getLineInfo(line);
        if (indentText) {
            const indentLevel = getIndentLevel(indentText, indentToken.size);
            const undentLength = indentText.length % indentToken.size || indentToken.size;
            tr.delete(tr.mapping.map(start + offset), tr.mapping.map(start + offset + undentLength));
        }
    });
    if (dispatch) {
        dispatch(tr);
    }
    return true;
}
function insertIndent(state, dispatch) {
    const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
    const { indentToken } = getLineInfo(textAtStartOfLine);
    const indentToAdd = indentToken.token.repeat(indentToken.size - (textAtStartOfLine.length % indentToken.size) || indentToken.size);
    dispatch(state.tr.insertText(indentToAdd));
    return true;
}
function insertNewlineWithIndent(state, dispatch) {
    const { text: textAtStartOfLine } = getStartOfCurrentLine(state);
    const { indentText } = getLineInfo(textAtStartOfLine);
    if (indentText && dispatch) {
        dispatch(state.tr.insertText('\n' + indentText));
        return true;
    }
    return false;
}
function isSelectionEntirelyInsideCodeBlock(state) {
    return state.selection.$from.sameParent(state.selection.$to) &&
        state.selection.$from.parent.type === state.schema.nodes.codeblock;
}
function getStartOfCurrentLine(state) {
    const { $from } = state.selection;
    if ($from.nodeBefore && $from.nodeBefore.isText) {
        const prevNewLineIndex = $from.nodeBefore.text.lastIndexOf('\n');
        return {
            text: $from.nodeBefore.text.substring(prevNewLineIndex + 1),
            pos: $from.start() + prevNewLineIndex + 1,
        };
    }
    return { text: '', pos: $from.pos };
}
;
function getEndOfCurrentLine(state) {
    const { $to } = state.selection;
    if ($to.nodeAfter && $to.nodeAfter.isText) {
        const nextNewLineIndex = $to.nodeAfter.text.indexOf('\n');
        return {
            text: $to.nodeAfter.text.substring(0, nextNewLineIndex >= 0 ? nextNewLineIndex : undefined),
            pos: nextNewLineIndex >= 0 ? $to.pos + nextNewLineIndex : $to.end(),
        };
    }
    return { text: '', pos: $to.pos };
}
;
function getLinesFromSelection(state) {
    const { pos: start } = getStartOfCurrentLine(state);
    const { pos: end } = getEndOfCurrentLine(state);
    const text = state.doc.textBetween(start, end);
    return { text, start, end };
}
function forEachLine(text, callback) {
    let offset = 0;
    text.split('\n').forEach(line => {
        callback(line, offset);
        offset += line.length + 1;
    });
}
;
const SPACE = { token: ' ', size: 2, regex: /[^ ]/ };
const TAB = { token: '\t', size: 1, regex: /[^\t]/ };
function getLineInfo(line) {
    const indentToken = line.startsWith('\t') ? TAB : SPACE;
    const indentLength = line.search(indentToken.regex);
    const indentText = line.substring(0, indentLength >= 0 ? indentLength : line.length);
    return { indentToken, indentText };
}
;
function toggleLineNumbers(state, dispatch) {
    if (!isSelectionEntirelyInsideCodeBlock(state))
        return false;
    if (dispatch) {
        let codeblock = state.selection.$from.parent;
        let start = state.selection.$from.pos - state.selection.$from.parentOffset - 1;
        dispatch(state.tr.setNodeMarkup(start, undefined, { lineNumbers: !codeblock.attrs.lineNumbers }));
    }
    return true;
}
exports.toggleLineNumbers = toggleLineNumbers;
