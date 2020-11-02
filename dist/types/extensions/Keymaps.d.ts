import Extension from './Extension';
declare function selectEntireTextblock(state: any, dispatch: any, view: any): boolean;
export default class Keymaps extends Extension {
    get name(): string;
    keys(): {
        "Mod-c": typeof selectEntireTextblock;
        "Mod-x": typeof selectEntireTextblock;
    };
}
export {};
//# sourceMappingURL=Keymaps.d.ts.map