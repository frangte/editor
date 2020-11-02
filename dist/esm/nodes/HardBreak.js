import Node from "./Node";
import { chainCommands, exitCode } from 'prosemirror-commands';
function exitAndInsert(nodeType) {
    return chainCommands(exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
        return true;
    });
}
export default class HardBreak extends Node {
    get name() {
        return 'hardbreak';
    }
    get schema() {
        return {
            inline: true,
            group: "inline",
            selectable: false,
            parseDOM: [{ tag: 'br' }],
            toDOM() { return ['br']; },
        };
    }
    keys({ nodeType }) {
        return {
            'Mod-Enter': exitAndInsert(nodeType),
            'Shift-Enter': exitAndInsert(nodeType),
        };
    }
}
