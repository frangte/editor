"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const commands_1 = require("../commands");
class TodoList extends Node_1.default {
    get name() {
        return 'todolist';
    }
    get schema() {
        return {
            group: 'block',
            content: 'todoitem+',
            toDOM() { return ['ul', { class: 'todo-list' }, 0]; },
            parseDOM: [{ tag: 'ul.todo-list' }],
        };
    }
    commands({ nodeType, schema }) {
        return () => commands_1.toggleList(nodeType);
    }
    toMarkdown(state, node) {
        state.renderList(node, "  ", () => "- ");
    }
    parseMarkdown() {
        return { block: "checkbox_list" };
    }
}
exports.default = TodoList;
