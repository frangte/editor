"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const EmojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
class Emoji extends Node_1.default {
    get emoji() {
        return 'emoji';
    }
    get schema() {
        return {
            attrs: { unicode: { default: "" }, name: { default: "" } },
            content: "text",
            group: "inline",
            parseDOM: [],
            toDOM: (node) => ['span', { class: "emoji" }, 0],
        };
    }
}
exports.default = Emoji;
