import Mark from './Mark';
import markInputRule from '../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Italic extends Mark {
    get name() {
        return 'italic';
    }
    get schema() {
        return {
            parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
            toDOM() { return ["em", 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-i': toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?<!\S\w)(?:^|[^_])(_([^_]+)_)(?!\S\w)$/, markType),
            markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, markType),
        ];
    }
    get toMarkdown() {
        return {
            open: "*",
            close: "*",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "em" };
    }
}
