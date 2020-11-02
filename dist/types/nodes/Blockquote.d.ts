import Node from "./Node";
import type { NodeSpec } from "prosemirror-model";
export default class Blockquote extends Node {
    get name(): string;
    get schema(): NodeSpec;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: any, dispatch: any, view: any) => boolean;
    keys({ nodeType }: {
        nodeType: any;
    }): {
        "Mod-]": (state: any, dispatch: any, view: any) => boolean;
    };
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=Blockquote.d.ts.map