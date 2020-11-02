import { toggleMark } from "prosemirror-commands";
import Extension, { Command } from "../extensions/Extension";
import type { Mark as PMMark, MarkSpec, MarkType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";

export default abstract class Mark extends Extension {

  constructor(options?: Record<string, any>) {
    super(options);
  }
  
  get type() {
    return "mark";
  }

  abstract get schema(): MarkSpec;

  keys?({markType, schema}: {markType: MarkType, schema: Schema}): Function | Record<string, Function>;

  commands({markType, schema}: {markType: MarkType, schema: Schema}) : Record<string, Command> | Command {
    return () => toggleMark(markType);
  }

  customNodeView?(props: CustomMarkViewProps): NodeView;

  get markdownToken(): string {
    return "";
  }

  get toMarkdown(): Record<string, any> {
    return {};
  }

  parseMarkdown() {
    return {};
  }
}

export type CustomMarkViewProps = {
  extension: Extension;
  node: PMMark;
  view: EditorView;
  getPos: boolean;
  decorations: Decoration[];
}