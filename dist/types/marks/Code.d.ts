import Mark from './Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Code extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    inputRules({ markType }: {
        markType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-e': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    get toMarkdown(): {
        open(state: any, mark: any, parent: any, index: any): string;
        close(state: any, mark: any, parent: any, index: any): string;
        escape: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Code.d.ts.map