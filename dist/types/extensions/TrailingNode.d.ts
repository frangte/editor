import Extension from "./Extension";
import { Plugin } from 'prosemirror-state';
export default class TrailingNode extends Extension {
    get name(): string;
    get defaultOptions(): {
        node: string;
    };
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=TrailingNode.d.ts.map