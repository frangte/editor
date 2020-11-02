"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_utils_1 = require("prosemirror-utils");
function nodeIsActive(state, type, attrs = {}) {
    const predicate = node => node.type === type;
    const node = prosemirror_utils_1.findSelectedNodeOfType(type)(state.selection)
        || prosemirror_utils_1.findParentNode(predicate)(state.selection);
    if (!Object.keys(attrs).length || !node) {
        return !!node;
    }
    return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
}
exports.default = nodeIsActive;
