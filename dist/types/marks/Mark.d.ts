import Extension, { Command } from "../extensions/Extension";
import type { Mark as PMMark, MarkSpec, MarkType, Schema } from "prosemirror-model";
import type { NodeView, EditorView, Decoration } from "prosemirror-view";
export default abstract class Mark extends Extension {
    constructor(options?: Record<string, any>);
    get type(): string;
    abstract get schema(): MarkSpec;
    keys?({ markType, schema }: {
        markType: MarkType;
        schema: Schema;
    }): Function | Record<string, Function>;
    commands({ markType, schema }: {
        markType: MarkType;
        schema: Schema;
    }): Record<string, Command> | Command;
    customNodeView?(props: CustomMarkViewProps): NodeView;
    get markdownToken(): string;
    get toMarkdown(): Record<string, any>;
    parseMarkdown(): {};
}
export declare type CustomMarkViewProps = {
    extension: Extension;
    node: PMMark;
    view: EditorView;
    getPos: boolean;
    decorations: Decoration[];
};
//# sourceMappingURL=Mark.d.ts.map