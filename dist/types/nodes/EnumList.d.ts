import Node from './Node';
import type { NodeSpec } from "prosemirror-model";
export default class EnumList extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): () => (state: any, dispatch: any) => boolean;
    keys({ nodeType, schema }: {
        nodeType: any;
        schema: any;
    }): {
        'Shift-Ctrl-9': (state: any, dispatch: any) => boolean;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
}
//# sourceMappingURL=EnumList.d.ts.map