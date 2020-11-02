import Node from "./Node";
import { Plugin } from "prosemirror-state";
import type { NodeSpec } from "prosemirror-model";
export default class Image extends Node {
    get name(): string;
    get schema(): NodeSpec;
    commands({ nodeType }: {
        nodeType: any;
    }): (attrs: any) => (state: any, dispatch: any) => void;
    get plugins(): Plugin<any, any>[];
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        node: string;
        getAttrs: (token: any) => {
            src: any;
            alt: any;
        };
    };
}
//# sourceMappingURL=Image.d.ts.map