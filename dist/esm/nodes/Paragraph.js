import { setBlockType } from "prosemirror-commands";
import Node from "./Node";
export default class Paragraph extends Node {
    get name() {
        return "paragraph";
    }
    get schema() {
        return {
            content: "inline*",
            group: "block",
            parseDOM: [{ tag: "p" }],
            toDOM() { return ["p", 0]; },
        };
    }
    keys({ nodeType }) {
        return {
            "Shift-Ctrl-0": setBlockType(nodeType),
        };
    }
    commands({ nodeType }) {
        return () => setBlockType(nodeType);
    }
    toMarkdown(state, node) {
        if (node.textContent.trim() === "" &&
            node.childCount === 0 &&
            !state.inTable) {
            state.write("\\\n");
        }
        else {
            state.renderInline(node);
            state.closeBlock(node);
        }
    }
    parseMarkdown() {
        return { block: "paragraph" };
    }
}
