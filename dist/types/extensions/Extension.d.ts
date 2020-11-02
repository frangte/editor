import type { InputRule } from "prosemirror-inputrules";
import type { Plugin } from "prosemirror-state";
import type Editor from "../editor";
export declare type Command = (attrs: any) => (state: any, dispatch: any) => any;
export default abstract class Extension {
    options: Record<string, any>;
    editor: Editor;
    constructor(options?: Record<string, any>);
    get type(): string;
    get name(): string;
    get defaultOptions(): {};
    get plugins(): Plugin[];
    keys?(options: any): {};
    inputRules?(options: any): InputRule[];
    commands?(options: any): Record<string, Command> | Command;
}
//# sourceMappingURL=Extension.d.ts.map