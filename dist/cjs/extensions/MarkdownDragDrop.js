"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("./Extension"));
const prosemirror_state_1 = require("prosemirror-state");
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const MarkdownDragDropPlugin = new prosemirror_state_1.Plugin({
    props: {
        handleDOMEvents: {
            drop(view, event) {
                const files = getDataTransferFiles_1.default(event);
                if (files && files.length === 1) {
                    event.preventDefault();
                    const reader = new FileReader();
                    reader.onload = event => {
                    };
                    reader.readAsText(files[0]);
                }
                return true;
            }
        }
    }
});
class MarkdownDragDrop extends Extension_1.default {
    get name() {
        return "MarkdownDragDrop";
    }
    get plugins() {
        return [
            MarkdownDragDropPlugin
        ];
    }
}
exports.default = MarkdownDragDrop;
