import type { Decoration, NodeView, EditorView } from "prosemirror-view"
import type { Node as PMNode } from "prosemirror-model"
import Node, { CustomNodeViewProps } from "../Node"

export default class ToggleItemView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  extension: Node;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  decorations: Decoration[];

  constructor(props: CustomNodeViewProps) {
    this.extension = props.extension as Node;
    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos;
    this.decorations = props.decorations

    this.dom = document.createElement("li")
    this.dom.classList.add("toggle-item")
    this.dom.dataset.toggled = this.node.attrs.toggled;
    this.dom.dataset.content = (this.node.childCount !== 1).toString();

    this.contentDOM = document.createElement("div")
    this.contentDOM.classList.add("toggle-content")

    const handleClickOnCheckbox = (event: MouseEvent) => {
      event.preventDefault(); 
      this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {toggled: !this.node.attrs.toggled}))
    }

    const checkbox = document.createElement("span")
    checkbox.classList.add("toggle-checkbox")
    checkbox.onmousedown = handleClickOnCheckbox

    this.dom.appendChild(checkbox)
    this.dom.appendChild(this.contentDOM)
  }

  update (node: PMNode, decorations: Decoration[]): boolean {
    console.log("update goggle")
    if (node.type !== this.node.type) return false;
    console.log(this.getPos(), (this.node.nodeSize - this.node.firstChild.nodeSize) !== (node.nodeSize - node.firstChild.nodeSize), node.attrs.toggled === false);

    if ((this.node.nodeSize - this.node.firstChild.nodeSize) !== (node.nodeSize - node.firstChild.nodeSize) && node.attrs.toggled === false)
      this.view.dispatch(this.view.state.tr.setNodeMarkup(this.getPos(), undefined, {toggled: !node.attrs.toggled}))
    this.node = node;
    this.decorations = decorations;
    this.dom.dataset.toggled = this.node.attrs.toggled;
    this.dom.dataset.content = (this.node.childCount !== 1).toString();
    return true
  }
}