import Node from "./Node"
import { Plugin } from "prosemirror-state"
import type { Node as PMNode, NodeSpec } from "prosemirror-model";

export default class Image extends Node {

  get name() {
    return "image"
  }

  get schema(): NodeSpec {
    return {
      inline: false,
      attrs: {src: {default: ""}, alt: {default: null}, title: {default: null}},
      parseDOM: [{tag: "img[src]", getAttrs(dom: HTMLImageElement) {
        return {
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          title: dom.getAttribute("title"),
        }
      }}],
      toDOM(node) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
    }
  }

  commands({nodeType}) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = nodeType.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  get plugins() {
    const uploadImage = this.options.uploadImage;
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste(view, event): boolean {
              event = event as ClipboardEvent
              // TODO: copy-and-paste image
              return false
            },
            drop(view, event): boolean {
              event = event as DragEvent
              // TODO: image drag-and-drop
              return false
            },
          },
        },
      }),
    ]
  }

  toMarkdown(state, node) {
    const caption = state.esc((node.attrs.alt || "").replace("\n", "") || ""),
      source = state.esc(node.attrs.src);
    state.write(`![${caption}](${source})`);
  }

  parseMarkdown() {
    return {
      node: "image",
      getAttrs: token => ({
        src: token.attrGet("src"),
        alt: (token.children[0] && token.children[0].content) || null,
      }),
    };
  }
}