"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const katex_1 = __importDefault(require("katex"));
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
class MathBlockView {
    constructor(props) {
        this.extension = props.extension;
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.decorations = props.decorations;
        this.dom = document.createElement("div");
        this.dom.classList.add("mathblock");
        this.contentDOM = document.createElement("code");
        this.contentDOM.spellcheck = false;
        const render = document.createElement("div");
        render.classList.add("katex-render");
        render.contentEditable = 'false';
        render.onclick = () => copy_to_clipboard_1.default(this.node.textContent);
        render.setAttribute("aria-label", 'click to copy');
        this.render = render;
        this.renderKatex();
        const preDiv = document.createElement("pre");
        preDiv.classList.add("katex-editor");
        preDiv.dataset.lang = "stex";
        preDiv.appendChild(this.contentDOM);
        this.dom.appendChild(render);
        this.dom.appendChild(preDiv);
    }
    renderKatex() {
        const content = !!this.node.textContent ? this.node.textContent : `\\text{${this.extension.options.emptyText}}`;
        katex_1.default.render(content, this.render, { displayMode: true, throwOnError: false, errorColor: "#FF6666" });
    }
    update(node, decorations) {
        if (node.type !== this.node.type)
            return false;
        this.node = node;
        this.decorations = decorations;
        this.renderKatex();
        return true;
    }
}
exports.default = MathBlockView;
