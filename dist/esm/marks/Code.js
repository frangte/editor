import Mark from './Mark';
import markInputRule from '../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
function backticksFor(node, side) {
    let m, len = 0;
    if (node.isText)
        while ((m = /`+/g.exec(node.text)) !== undefined)
            len = Math.max(len, m[0].length);
    let result = len > 0 && side > 0 ? " `" : "`";
    for (let i = 0; i < len; i++)
        result += "`";
    if (len > 0 && side < 0)
        result += " ";
    return result;
}
export default class Code extends Mark {
    get name() {
        return 'code';
    }
    get schema() {
        return {
            inclusive: false,
            toDOM() { return ["code", { "spellCheck": "false" }, 0]; },
            parseDOM: [{ tag: "code" }],
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:`)([^`]+)(?:`)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-e': toggleMark(markType),
        };
    }
    get toMarkdown() {
        return {
            open(state, mark, parent, index) {
                return backticksFor(parent.child(index), -1);
            },
            close(state, mark, parent, index) {
                return backticksFor(parent.child(index - 1), 1);
            },
            escape: false,
        };
    }
    parseMarkdown() {
        return { mark: "code_inline" };
    }
}
