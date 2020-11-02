import Node from '../Node';
import { splitListItem } from "prosemirror-schema-list";
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';
import CustomNodeView from "./nodeview";
import { InputRule } from 'prosemirror-inputrules';
import { findWrapping, canJoin } from "prosemirror-transform";
import { ReplaceAroundStep } from "prosemirror-transform";
import { Slice, Fragment } from "prosemirror-model";
function listInputRule(regex, nodeType, getAttrs, joinPredicate) {
    return new InputRule(regex, (state, match, start, end) => {
        let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        let tr = state.tr.delete(start, end);
        let $start = tr.doc.resolve(start), range = $start.blockRange();
        let insideList = range.depth >= 2 && range.$from.node(range.depth - 1).type.name.includes("list") && range.startIndex == 0;
        if (insideList == false)
            return null;
        let itemType = range.parent.type, $from, $to, item;
        $from = $to = $start;
        range = $from.blockRange($to, node => node.childCount && node.firstChild.type == itemType);
        if (!range)
            return null;
        let list = range.parent;
        for (let pos = range.end, i = range.endIndex - 1, e = range.startIndex; i > e; i--) {
            pos -= list.child(i).nodeSize;
            tr.delete(pos - 1, pos + 1);
        }
        $start = tr.doc.resolve(range.start), item = $start.nodeAfter;
        let atStart = range.startIndex == 0, atEnd = range.endIndex == list.childCount;
        let parent = $start.node(-1), indexBefore = $start.index(-1);
        if (!parent.canReplace(indexBefore + (atStart ? 0 : 1), indexBefore + 1, item.content.append(atEnd ? Fragment.empty : Fragment.from(list))))
            return null;
        start = $start.pos, end = start + item.nodeSize;
        tr.step(new ReplaceAroundStep(start - (atStart ? 1 : 0), end + (atEnd ? 1 : 0), start + 1, end - 1, new Slice((atStart ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))).append(atEnd ? Fragment.empty : Fragment.from(list.copy(Fragment.empty))), atStart ? 0 : 1, atEnd ? 0 : 1), atStart ? 0 : 1));
        $from = tr.doc.resolve(start + (atStart ? 0 : 2)), $to = tr.doc.resolve(end - 1 - (atStart ? 2 : 0));
        range = $from.blockRange($to);
        if (!range)
            return null;
        let wrapping = range && findWrapping(range, nodeType, attrs);
        if (!wrapping)
            return null;
        tr.wrap(range, wrapping);
        let before = tr.doc.resolve(start - 1).nodeBefore;
        console.log(before, before.lastChild);
        if (before && (before.type == nodeType || (before.lastChild && before.lastChild.type == nodeType)) && canJoin(tr.doc, start - 1) &&
            (!joinPredicate || joinPredicate(match, before)))
            tr.join(start - 1);
        return tr;
    });
}
import { toggleChecked } from './keymaps';
function wrappingInputRule(regexp, nodeType, getAttrs, joinPredicate) {
    return new InputRule(regexp, (state, match, start, end) => {
        let attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
        let tr = state.tr.delete(start, end);
        let $start = tr.doc.resolve(start), range = $start.blockRange(), wrapping = range && findWrapping(range, nodeType, attrs);
        if (!wrapping)
            return null;
        tr.wrap(range, wrapping);
        let before = tr.doc.resolve(start - 1).nodeBefore;
        if (before && (before.type == nodeType || (before.lastChild && before.lastChild.type == nodeType)) && canJoin(tr.doc, start - 1) &&
            (!joinPredicate || joinPredicate(match, before)))
            tr.join(start - 1);
        return tr;
    });
}
export default class TodoItem extends Node {
    get name() {
        return "todoitem";
    }
    get schema() {
        return {
            attrs: { checked: { default: false } },
            content: "paragraph block*",
            draggable: true,
            parseDOM: [{
                    tag: `li.todo-item`,
                    getAttrs: dom => ({ checked: dom.getAttribute('data-checked') === 'true' }),
                }],
            toDOM(node) {
                return ['li', { class: "todo-item", 'data-checked': node.attrs.checked }, ['span', { class: 'todo-checkbox', contenteditable: 'false' }], ['div', { class: 'todo-content' }, 0]];
            },
        };
    }
    inputRules({ nodeType }) {
        return [
            listInputRule(/^\[(x| )?\]\s$/, nodeType, (regexMatch) => {
                const [match, checked] = regexMatch;
                return { checked: checked === "x" };
            }),
            wrappingInputRule(/^\[(x| )?\]\s$/, nodeType, (regexMatch) => {
                const [match, checked] = regexMatch;
                return { checked: checked === "x" };
            }),
        ];
    }
    keys({ nodeType }) {
        return {
            'Ctrl-l': toggleChecked,
            Enter: splitListItem(nodeType),
            Tab: sinkListItem(nodeType),
            'Shift-Tab': liftListItem(nodeType),
        };
    }
    toMarkdown(state, node) {
        state.write(node.attrs.checked ? "[x] " : "[ ] ");
        state.renderContent(node);
    }
    parseMarkdown() {
        return {
            block: "checkbox_item",
            getAttrs: tok => ({
                checked: tok.attrGet("checked") ? true : undefined,
                id: tok.attrGet("id"),
            }),
        };
    }
    customNodeView(props) {
        return new CustomNodeView(props);
    }
}
