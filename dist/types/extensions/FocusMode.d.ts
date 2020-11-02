import Extension from "./Extension";
import { Plugin, PluginKey } from 'prosemirror-state';
export default class FocusMode extends Extension {
    pluginKey: PluginKey;
    constructor(options?: any);
    get name(): string;
    keys(): {
        "Shift-Ctrl-f": (state: any, dispatch: any) => boolean;
    };
    commands(): () => (state: any, dispatch: any) => boolean;
    get plugins(): Plugin<any, any>[];
}
//# sourceMappingURL=FocusMode.d.ts.map