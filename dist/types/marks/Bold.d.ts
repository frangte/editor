import Mark from './Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Bold extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    inputRules({ markType }: {
        markType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-b': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
    };
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Bold.d.ts.map