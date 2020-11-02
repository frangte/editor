"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
class Placeholder extends Extension_1.default {
    get name() {
        return 'placeholder';
    }
    get defaultOptions() {
        return {
            emptyNodeClass: 'ProseMirror-emptynode',
            activeNodeClass: 'ProseMirror-activenode',
            cursorNodeClass: 'ProseMirror-cursornode',
            showOnlyWhenEditable: true,
        };
    }
    get update() {
        console.log("update");
        return view => view.updateState(view.state);
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    decorations: ({ doc, selection }) => {
                        const { from, to, $cursor } = selection;
                        const decorations = [];
                        const getDecorations = (node, pos) => {
                            if (node.isBlock === false)
                                return false;
                            const classes = [];
                            const hasSelection = pos <= to && from <= pos + node.nodeSize;
                            const isEmpty = node.textContent.length === 0;
                            const hasCursor = $cursor && pos <= $cursor.pos && $cursor.pos <= pos + node.nodeSize;
                            hasSelection && classes.push(this.options.activeNodeClass);
                            isEmpty && classes.push(this.options.emptyNodeClass);
                            hasCursor && classes.push(this.options.cursorNodeClass);
                            if (classes.length !== 0)
                                decorations.push(prosemirror_view_1.Decoration.node(pos, pos + node.nodeSize, { 'class': classes.join(' ') }));
                            return node.isBlock;
                        };
                        doc.descendants(getDecorations);
                        return prosemirror_view_1.DecorationSet.create(doc, decorations);
                    },
                    attributes(state) {
                        const isEmpty = state.doc.textContent.length === 0;
                        return isEmpty ? { class: "ProseMirror-emptydoc" } : null;
                    }
                },
            }),
        ];
    }
}
exports.default = Placeholder;
