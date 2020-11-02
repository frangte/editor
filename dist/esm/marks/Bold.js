import Mark from './Mark';
import markInputRule from '../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Bold extends Mark {
    get name() {
        return "bold";
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'strong' }, { tag: 'b', getAttrs: (dom) => dom.style.fontWeight !== 'normal' && null }, { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[7-9]\d{2,})$/.test(value) && null }],
            toDOM: () => ['strong', 0],
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?<=\s|\W|^)(?:\*\*|__)([^*_]+)(?:\*\*|__)(?=\s|\W|$)$/, markType),
        ];
    }
    keys({ markType }) {
        return {
            'Mod-b': toggleMark(markType),
        };
    }
    get toMarkdown() {
        return {
            open: "**",
            close: "**",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    parseMarkdown() {
        return { mark: "strong" };
    }
}
