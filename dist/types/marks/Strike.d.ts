import Mark from './Mark';
import type { MarkSpec } from "prosemirror-model";
export default class Strike extends Mark {
    get name(): string;
    get schema(): MarkSpec;
    keys({ markType }: {
        markType: any;
    }): {
        'Mod-d': (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    };
    inputRules({ markType }: {
        markType: any;
    }): import("prosemirror-inputrules").InputRule<any>[];
    get toMarkdown(): {
        open: string;
        close: string;
        mixable: boolean;
        expelEnclosingWhitespace: boolean;
    };
    get markdownToken(): string;
    parseMarkdown(): {
        mark: string;
    };
}
//# sourceMappingURL=Strike.d.ts.map