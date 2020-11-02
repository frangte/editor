import Node, { CustomNodeViewProps } from '../Node'
import type { Node as PMNode } from "prosemirror-model";
import katex from "katex"
import copy from 'copy-to-clipboard';
import type { Decoration, NodeView, EditorView } from 'prosemirror-view';

export default class MathBlockView implements NodeView {

  dom: HTMLElement;
  contentDOM: HTMLElement;
  extension: Node;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  decorations: Decoration[];
  render: HTMLElement;

  renderKatex () {
    const content = !!this.node.textContent ? this.node.textContent : `\\text{${this.extension.options.emptyText}}`
    katex.render(content, this.render, {displayMode: true, throwOnError: false, errorColor: "#FF6666"})
  }

  constructor (props: CustomNodeViewProps) {
    this.extension = (props.extension as Node);
    this.node = props.node;
    this.view = props.view;
    this.getPos = props.getPos;
    this.decorations = props.decorations

    this.dom = document.createElement("div")
    this.dom.classList.add("mathblock")

    this.contentDOM = document.createElement("code")
    this.contentDOM.spellcheck = false;

    const render = document.createElement("div")
    render.classList.add("katex-render")
    render.contentEditable = 'false';
    render.onclick = () => copy(this.node.textContent);
    render.setAttribute("aria-label", 'click to copy') 

    this.render = render;
    this.renderKatex()

    const preDiv = document.createElement("pre")
    preDiv.classList.add("katex-editor")
    preDiv.dataset.lang = "stex"
    preDiv.appendChild(this.contentDOM)
    
    this.dom.appendChild(render)
    this.dom.appendChild(preDiv)
  }

  update (node: PMNode, decorations: Decoration[]): boolean {
    if (node.type !== this.node.type) return false;
    this.node = node;
    this.decorations = decorations;
    this.renderKatex();
    return true
  }
}
