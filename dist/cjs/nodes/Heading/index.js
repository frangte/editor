"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("../Node"));
const commands_1 = require("../../commands");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
class Heading extends Node_1.default {
    get name() {
        return 'heading';
    }
    get schema() {
        return {
            attrs: { level: { default: 1 } },
            content: "inline*",
            group: "block",
            defining: true,
            parseDOM: [
                { tag: "h1", attrs: { level: 1 } },
                { tag: "h2", attrs: { level: 2 } },
                { tag: "h3", attrs: { level: 3 } },
                { tag: "h4", attrs: { level: 4 } },
                { tag: "h5", attrs: { level: 5 } },
                { tag: "h6", attrs: { level: 6 } }
            ],
            toDOM(node) { return ["h" + node.attrs.level, 0]; },
            toMarkdown: this.toMarkdown
        };
    }
    get defaultOptions() {
        return {
            maxLevel: 6,
            modifyDOM: (node, contentDOM) => {
                let anchorSlug = node.textContent.replace(/[^a-zA-Z0-9\s]+/g, '').trim();
                anchorSlug === "" ? contentDOM.removeAttribute("id") : contentDOM.id = anchorSlug.replace(/\s+/g, '-');
            }
        };
    }
    commands({ nodeType, schema }) {
        return attrs => commands_1.toggleBlockType(nodeType, schema.nodes.paragraph, attrs);
    }
    inputRules({ nodeType }) {
        return [
            prosemirror_inputrules_1.textblockTypeInputRule(new RegExp("^(#{1," + this.options.maxLevel + "})\\s$"), nodeType, match => ({ level: match[1].length }))
        ];
    }
    toMarkdown(state, node) {
        state.write(state.repeat("#", node.attrs.level) + " ");
        state.renderInline(node);
        state.closeBlock(node);
    }
}
exports.default = Heading;
