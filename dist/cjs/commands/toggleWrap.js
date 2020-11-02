"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prosemirror_commands_1 = require("prosemirror-commands");
const utils_1 = require("../utils");
function toggleWrap(type) {
    return (state, dispatch, view) => {
        const isActive = utils_1.nodeIsActive(state, type);
        if (isActive)
            return prosemirror_commands_1.lift(state, dispatch);
        return prosemirror_commands_1.wrapIn(type)(state, dispatch);
    };
}
exports.default = toggleWrap;
