"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Extension_1 = __importDefault(require("../Extension"));
const syntax_highlight_plugin_1 = __importDefault(require("./syntax-highlight-plugin"));
class SyntaxHighlight extends Extension_1.default {
    get name() {
        return "syntax-highlight";
    }
    get plugins() {
        return [syntax_highlight_plugin_1.default()];
    }
}
exports.default = SyntaxHighlight;
