"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const commands_1 = require("../commands");
class Divider extends Node_1.default {
    get name() {
        return 'divider';
    }
    get schema() {
        return {
            group: 'block',
            parseDOM: [{ tag: 'hr' }],
            toDOM() { return ['hr']; },
        };
    }
    commands({ nodeType }) {
        return () => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView());
    }
    inputRules({ nodeType }) {
        return [
            commands_1.nodeInputRule(/^(?:---|___\s|\*\*\*\s)$/, nodeType),
        ];
    }
}
exports.default = Divider;
