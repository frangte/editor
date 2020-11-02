import Mark from './Mark';
import { toggleMark } from "prosemirror-commands";
import markInputRule from '../commands/markInputRule';
export default class Underline extends Mark {
    get name() {
        return 'underline';
    }
    get schema() {
        return {
            parseDOM: [{ tag: 'u' }, { style: 'text-decoration', getAttrs: (value) => value === 'underline' ? null : false }],
            toDOM() { return ['u', 0]; },
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule(/(?:__)([^_]+)(?:__)$/, markType)
        ];
    }
    keys({ markType }) {
        return {
            'Mod-u': toggleMark(markType),
        };
    }
}
