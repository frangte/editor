"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mark_1 = __importDefault(require("./Mark"));
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const prosemirror_commands_1 = require("prosemirror-commands");
const prosemirror_state_1 = require("prosemirror-state");
function isPlainURL(link, parent, index, side) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href))
        return false;
    const content = parent.child(index + (side < 0 ? -1 : 0));
    if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link)
        return false;
    if (index == (side < 0 ? 1 : parent.childCount - 1))
        return true;
    const next = parent.child(index + (side < 0 ? -2 : 1));
    return !link.isInSet(next.marks);
}
class Link extends Mark_1.default {
    get name() {
        return "link";
    }
    get defaultOptions() {
        return {
            onClickLink: (event) => window.open(event.target.href),
        };
    }
    get schema() {
        return {
            attrs: { href: {}, title: { default: null } },
            inclusive: false,
            parseDOM: [{ tag: "a[href]", getAttrs(dom) { return { href: dom.getAttribute("href"), title: dom.getAttribute("title") }; } }],
            toDOM(mark) { let { href, title } = mark.attrs; return ["a", { href, title, rel: "noopener noreferrer nofollow" }, 0]; },
        };
    }
    keys({ markType }) {
        return {
            "Mod-k": (state, dispatch) => {
                return prosemirror_commands_1.toggleMark(markType, { href: "" })(state, dispatch);
            },
        };
    }
    commands({ markType }) {
        return ({ href } = { href: "" }) => prosemirror_commands_1.toggleMark(markType, { href });
    }
    inputRules({ markType }) {
        return [
            new prosemirror_inputrules_1.InputRule(/\[\[([^|\s]+)[|\s]?([^|\s]+)?\]\]$/, (state, match, start, end) => {
                const [okay, href, text] = match;
                const { tr, schema } = state;
                if (okay) {
                    tr.replaceWith(start, end, schema.text(text || href));
                    tr.addMark(start, start + (text || href).length, markType.create({ href }));
                }
                return tr;
            }),
            new prosemirror_inputrules_1.InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
                const [okay, alt, href] = match;
                const { tr, schema } = state;
                if (okay) {
                    tr.replaceWith(start, end, schema.text(alt));
                    tr.addMark(start, start + alt.length, markType.create({ href }));
                }
                return tr;
            }),
        ];
    }
    get plugins() {
        return [
            new prosemirror_state_1.Plugin({
                props: {
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            if (event.target instanceof HTMLAnchorElement && this.options.onHoverLink)
                                return this.options.onHoverLink(event);
                            return false;
                        },
                    },
                    handleClick: (view, pos, event) => {
                        if (!(event.target instanceof HTMLAnchorElement))
                            return false;
                        if (view.editable && !(event.altKey || event.button === 2))
                            return false;
                        if (!this.options.onClickLink)
                            return false;
                        event.stopPropagation();
                        event.preventDefault();
                        this.options.onClickLink(event);
                        return true;
                    },
                    handlePaste: (view, event, slice) => {
                        const getLink = hasFragment => {
                            const { content: { content } } = hasFragment;
                            const [child] = content;
                            if (content.length == 1 && child.isText)
                                try {
                                    new URL(child.text);
                                    return child.text;
                                }
                                catch (error) {
                                    return false;
                                }
                            if (content.length == 1 && child.isTextblock)
                                return getLink(child);
                            return false;
                        };
                        const validURL = getLink(slice);
                        if (validURL) {
                            const { schema, selection, tr } = view.state;
                            const { empty, ranges } = selection;
                            if (empty)
                                return false;
                            for (let i = 0; i < ranges.length; i++) {
                                const { $from, $to } = ranges[i];
                                tr.addMark($from.pos, $to.pos, schema.marks.link.create({ href: validURL }));
                            }
                            view.dispatch(tr.scrollIntoView());
                            return true;
                        }
                        return false;
                    }
                }
            })
        ];
    }
    get toMarkdown() {
        return {
            open(_state, mark, parent, index) {
                return isPlainURL(mark, parent, index, 1) ? "<" : "[";
            },
            close(state, mark, parent, index) {
                return isPlainURL(mark, parent, index, -1) ? ">" : "]("
                    + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")";
            },
        };
    }
    parseMarkdown() {
        return {
            mark: "link",
            getAttrs: tok => ({
                href: tok.attrGet("href"),
                title: tok.attrGet("title") || null,
            }),
        };
    }
}
exports.default = Link;
