import type { MarkdownSerializerState } from "prosemirror-markdown";
import type { Node as PMNode, NodeSpec, NodeType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
import Extension, { Command } from "../extensions/Extension";

export default abstract class Node extends Extension {

  constructor(options?: Record<string, any>) {
    super(options);
  }

  get type() {
    return "node" as const;
  }

  abstract get schema(): NodeSpec;

  keys?({nodeType, schema}: {nodeType: NodeType, schema: Schema}): Function | Record<string, Function>;

  commands?({nodeType, schema}: {nodeType: NodeType, schema: Schema}): Record<string, Command> | Command;

  customNodeView?(props: CustomNodeViewProps): NodeView;
 
  get markdownToken(): string {
    return "";
  }

  toMarkdown(state: MarkdownSerializerState, node: PMNode) {
    console.error("toMarkdown not implemented", state, node);
  }

  parseMarkdown() {
    return;
  }
}

export type CustomNodeViewProps = {
  extension: Extension;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  decorations: Decoration[];
}