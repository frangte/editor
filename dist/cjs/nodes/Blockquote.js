"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const commands_1 = require("../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
class Blockquote extends Node_1.default {
    get name() {
        return "blockquote";
    }
    get schema() {
        return {
            content: "block+",
            group: "block",
            parseDOM: [{ tag: "blockquote" }],
            toDOM() { return ["blockquote", 0]; },
        };
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.wrappingInputRule(/^>\s$/, nodeType)
        ];
    }
    commands({ nodeType }) {
        return () => commands_1.toggleWrap(nodeType);
    }
    keys({ nodeType }) {
        return {
            "Mod-]": commands_1.toggleWrap(nodeType),
        };
    }
    toMarkdown(state, node) {
        state.wrapBlock("> ", null, node, () => state.renderContent(node));
    }
    parseMarkdown() {
        return { block: "blockquote" };
    }
}
exports.default = Blockquote;
