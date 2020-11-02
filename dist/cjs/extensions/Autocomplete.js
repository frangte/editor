"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../commands");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_view_1 = require("prosemirror-view");
function positionMatcher(regexp, position) {
    const text = position.doc.textBetween(position.before(), position.end(), '\0', '\0');
    let match;
    if ((match = regexp.exec(text)) !== null) {
        const from = match.index + position.start();
        let to = from + match[0].length;
        if (from < position.pos && to >= position.pos)
            return { range: { from, to }, query: match[1], text: match[0] };
    }
}
function Autocomplete({ matcher, appendText, suggestionClass, command, onEnter, onChange, onLeave, onKeyDown, onFilter }) {
    return new prosemirror_state_1.Plugin({
        key: new prosemirror_state_1.PluginKey('Autocomplete'),
        view() {
            return {
                update: (view, prevState) => {
                    const prev = this.key.getState(prevState);
                    const next = this.key.getState(view.state);
                    const moved = prev.active && next.active && prev.range.from !== next.range.from;
                    const started = !prev.active && next.active;
                    const stopped = prev.active && !next.active;
                    const changed = !started && !stopped && prev.query !== next.query;
                    const handleStart = started || moved;
                    const handleChange = changed && !moved;
                    const handleExit = stopped || moved;
                    if (!handleStart && !handleChange && !handleExit)
                        return;
                    const state = handleExit ? prev : next;
                    const decorationNode = document.querySelector(`.${suggestionClass}`);
                    console.log(handleStart, handleChange, handleExit);
                    onFilter(state.query);
                    const props = {
                        view,
                        range: state.range,
                        query: state.query,
                        text: state.text,
                        decorationNode,
                        command: ({ range, attrs }) => {
                            command({
                                range,
                                attrs,
                                schema: view.state.schema,
                            })(view.state, view.dispatch, view);
                            if (appendText)
                                commands_1.insertText(appendText)(view.state, view.dispatch);
                        },
                    };
                    handleExit && onLeave(props);
                    handleChange && onChange(props);
                    handleStart && onEnter(props);
                },
            };
        },
        state: {
            init() {
                return { active: false, decorationId: null, range: {}, query: null, text: null };
            },
            apply(tr, prev) {
                const { selection: { $from, from, to } } = tr;
                let next = { ...prev, active: false, decorationId: null, range: {}, query: null, text: null };
                if (from == to && !$from.parent.type.spec.code) {
                    const match = positionMatcher(matcher, $from);
                    if (match) {
                        next = { ...next, active: true, ...match };
                        next.decorationId = prev.decorationId ? prev.decorationId : "suggestion";
                    }
                }
                return next;
            },
        },
        props: {
            handleKeyDown(view, event) {
                const { active, range, decorationNode } = this.getState(view.state);
                if (!active)
                    return false;
                const handle = onKeyDown({ view, event, range, decorationNode });
                console.log("active", active, handle);
                return handle;
            },
            decorations(editorState) {
                const { active, range, decorationId } = this.getState(editorState);
                if (!active)
                    return null;
                return prosemirror_view_1.DecorationSet.create(editorState.doc, [
                    prosemirror_view_1.Decoration.inline(range.from, range.to, {
                        nodeName: 'span', class: `ProseMirror-autocomplete ${suggestionClass}`
                    }),
                ]);
            },
        },
    });
}
exports.default = Autocomplete;
