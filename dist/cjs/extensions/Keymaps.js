"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_state_1 = require("prosemirror-state");
function selectEntireTextblock(state, dispatch, view) {
    if (state.selection.empty === false) {
        return false;
    }
    const $anchor = state.selection.$anchor;
    if ($anchor.parent.isTextblock === false) {
        return false;
    }
    const nodeStart = $anchor.pos - $anchor.parentOffset, nodeEnd = nodeStart + $anchor.parent.content.size;
    dispatch(state.tr.setSelection(prosemirror_state_1.TextSelection.create(state.doc, nodeStart, nodeEnd)));
    return true;
}
class Keymaps extends Extension_1.default {
    get name() {
        return 'keymaps';
    }
    keys() {
        return {
            "Mod-c": selectEntireTextblock,
            "Mod-x": selectEntireTextblock,
        };
    }
}
exports.default = Keymaps;
