import Node from "../Node";
import type { Node as PMNode, NodeSpec } from "prosemirror-model";
export default class Heading extends Node {
    get name(): string;
    get schema(): NodeSpec;
    get defaultOptions(): {
        maxLevel: number;
        modifyDOM: (node: PMNode, contentDOM: HTMLElement) => void;
    };
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): (attrs: any) => (state: any, dispatch: any, view: any) => boolean;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
}
//# sourceMappingURL=index.d.ts.map