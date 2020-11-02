import Mark from './Mark';
import { InputRule } from "prosemirror-inputrules";
import { Plugin } from "prosemirror-state";
import type { MarkSpec } from "prosemirror-model";
export default class Link extends Mark {
    get name(): string;
    get defaultOptions(): {
        onClickLink: (event: MouseEvent) => Window;
    };
    get schema(): MarkSpec;
    keys({ markType }: {
        markType: any;
    }): {
        "Mod-k": (state: any, dispatch: any) => boolean;
    };
    commands({ markType }: {
        markType: any;
    }): ({ href }?: {
        href: string;
    }) => (state: import("prosemirror-state").EditorState<any>, dispatch?: (tr: import("prosemirror-state").Transaction<any>) => void) => boolean;
    inputRules({ markType }: {
        markType: any;
    }): InputRule<any>[];
    get plugins(): Plugin<any, any>[];
    get toMarkdown(): {
        open(_state: any, mark: any, parent: any, index: any): "<" | "[";
        close(state: any, mark: any, parent: any, index: any): string;
    };
    parseMarkdown(): {
        mark: string;
        getAttrs: (tok: any) => {
            href: any;
            title: any;
        };
    };
}
//# sourceMappingURL=Link.d.ts.map