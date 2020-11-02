"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ToggleItemView {
    constructor(props) {
        this.extension = props.extension;
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.decorations = props.decorations;
        this.dom = document.createElement("li");
        this.dom.classList.add("toggle-item");
        this.dom.dataset.toggled = this.node.attrs.toggled;
        this.dom.dataset.content = (this.node.childCount !== 1).toString();
        this.contentDOM = document.createElement("div");
        this.contentDOM.classList.add("toggle-content");
        const handleClickOnCheckbox = (event) => {
            event.preventDefault();
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), undefined, { toggled: !this.node.attrs.toggled }));
        };
        const checkbox = document.createElement("span");
        checkbox.classList.add("toggle-checkbox");
        checkbox.onmousedown = handleClickOnCheckbox;
        this.dom.appendChild(checkbox);
        this.dom.appendChild(this.contentDOM);
    }
    update(node, decorations) {
        console.log("update goggle");
        if (node.type !== this.node.type)
            return false;
        console.log(this.getPos(), (this.node.nodeSize - this.node.firstChild.nodeSize) !== (node.nodeSize - node.firstChild.nodeSize), node.attrs.toggled === false);
        if ((this.node.nodeSize - this.node.firstChild.nodeSize) !== (node.nodeSize - node.firstChild.nodeSize) && node.attrs.toggled === false)
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), undefined, { toggled: !node.attrs.toggled }));
        this.node = node;
        this.decorations = decorations;
        this.dom.dataset.toggled = this.node.attrs.toggled;
        this.dom.dataset.content = (this.node.childCount !== 1).toString();
        return true;
    }
}
exports.default = ToggleItemView;
