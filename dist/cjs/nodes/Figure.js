"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const prosemirror_state_1 = require("prosemirror-state");
class Figure extends Node_1.default {
    get name() {
        return "figure";
    }
    get schema() {
        return {
            content: "image figcaption",
            group: "block",
            parseDOM: [{ tag: "figure" }],
            toDOM: () => ["figure", 0],
        };
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                appendTransaction: (transactions, oldState, newState) => {
                    const tr = newState.tr;
                    let modified = false;
                    newState.doc.descendants((node, pos, parent) => {
                        if (node.type.name != "figure")
                            return;
                        const imageNode = node.firstChild;
                        if (imageNode && imageNode.attrs.src === undefined && imageNode.attrs.alt === undefined) {
                            tr.deleteRange(pos, pos + node.nodeSize);
                            modified = true;
                        }
                    });
                    if (modified)
                        return tr;
                }
            })
        ];
    }
}
exports.default = Figure;
