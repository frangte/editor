import Mark from './Mark';
import markInputRule from '../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
export default class Strike extends Mark {
    get name() {
        return 'strike';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }, { style: 'text-decoration', getAttrs: value => value === 'line-through' ? undefined : false },],
            toDOM() { return ['s', 0]; },
        };
    }
    keys({ markType }) {
        return {
            'Mod-d': toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:~)([^~\s]+(?:\s+[^~\s]+)*)(?:~)$/, markType),
        ];
    }
    get toMarkdown() {
        return {
            open: "~~",
            close: "~~",
            mixable: true,
            expelEnclosingWhitespace: true,
        };
    }
    get markdownToken() {
        return "s";
    }
    parseMarkdown() {
        return { mark: "strikethrough" };
    }
}
