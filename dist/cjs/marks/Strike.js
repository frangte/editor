"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("./Mark"));
const markInputRule_1 = __importDefault(require("../commands/markInputRule"));
const prosemirror_commands_1 = require("prosemirror-commands");
class Strike extends Mark_1.default {
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
            'Mod-d': prosemirror_commands_1.toggleMark(markType),
        };
    }
    inputRules({ markType }) {
        return [
            markInputRule_1.default(/(?:~)([^~\s]+(?:\s+[^~\s]+)*)(?:~)$/, markType),
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
exports.default = Strike;
