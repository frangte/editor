import Node from './Node';
import type { NodeSpec } from "prosemirror-model";
export default class Divider extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): () => (state: any, dispatch: any) => any;
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
}
//# sourceMappingURL=Divider.d.ts.map