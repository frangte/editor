export default class TodoItemView {
    constructor(props) {
        this.extension = props.extension;
        this.node = props.node;
        this.view = props.view;
        this.getPos = props.getPos;
        this.decorations = props.decorations;
        this.dom = document.createElement("li");
        this.dom.classList.add("todo-item");
        this.dom.dataset.checked = this.node.attrs.checked;
        this.contentDOM = document.createElement("div");
        this.contentDOM.classList.add("todo-content");
        const handleClickOnCheckbox = (event) => {
            event.preventDefault();
            this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), undefined, { checked: !this.node.attrs.checked }));
        };
        const checkbox = document.createElement("span");
        checkbox.classList.add("todo-checkbox");
        checkbox.onmousedown = handleClickOnCheckbox;
        this.dom.appendChild(checkbox);
        this.dom.appendChild(this.contentDOM);
    }
    update(node, decorations) {
        if (node.type !== this.node.type)
            return false;
        this.node = node;
        this.decorations = decorations;
        this.dom.dataset.checked = this.node.attrs.checked;
        return true;
    }
}
