import Node from './Node';
import { toggleList } from "../commands";
export default class TodoList extends Node {
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
        return () => toggleList(nodeType);
    }
    toMarkdown(state, node) {
        state.renderList(node, "  ", () => "- ");
    }
    parseMarkdown() {
        return { block: "checkbox_list" };
    }
}
