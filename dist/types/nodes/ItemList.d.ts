import Node from './Node';
import type { NodeSpec } from "prosemirror-model";
import { InputRule } from 'prosemirror-inputrules';
export default class ItemList extends Node {
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
        'Shift-Ctrl-8': (state: any, dispatch: any) => boolean;
    };
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
    inputRules({ nodeType }: {
        nodeType: any;
    }): InputRule<any>[];
}
//# sourceMappingURL=ItemList.d.ts.map