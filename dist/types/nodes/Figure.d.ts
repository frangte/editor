import Node from './Node';
import { Plugin } from 'prosemirror-state';
import type { NodeSpec } from "prosemirror-model";
export default class Figure extends Node {
    get name(): string;
    get schema(): NodeSpec;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=Figure.d.ts.map