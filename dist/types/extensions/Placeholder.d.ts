import Extension from './Extension';
import { Plugin } from 'prosemirror-state';
export default class Placeholder extends Extension {
    get name(): string;
    get defaultOptions(): {
        emptyNodeClass: string;
        activeNodeClass: string;
        cursorNodeClass: string;
        showOnlyWhenEditable: boolean;
    };
    get update(): (view: any) => any;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=Placeholder.d.ts.map