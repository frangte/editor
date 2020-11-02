import Node, { CustomNodeViewProps } from '../Node';
import type { NodeSpec } from "prosemirror-model";
import MathBlockView from "./mathblock-nodeview";
export default class MathBlock extends Node {
    get name(): string;
    get schema(): NodeSpec;
    get defaultOptions(): {
        emptyText: string;
    };
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: any, dispatch: any, view: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Shift-Ctrl-\\": (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
        Tab: (state: any, dispatch: any, view: any) => boolean;
        "Shift-Tab": (state: any, dispatch: any, view: any) => boolean;
        Enter: (state: any, dispatch: any, view: any) => boolean;
        Backspace: (state: any, dispatch: any, view: any) => boolean;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
    get markdownToken(): string;
    parseMarkdown(): {
        block: string;
        getAttrs: (tok: any) => {
            language: any;
        };
    };
    customNodeView(props: CustomNodeViewProps): MathBlockView;
}
//# sourceMappingURL=index.d.ts.map