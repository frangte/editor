import Extension from './Extension';
import { InputRule } from "prosemirror-inputrules";
function punctuationHandler(string) {
    return (state, match, start, end) => {
        const insert = match[0].replace(new RegExp(`${match[1]}`, 'g'), string);
        return state.tr.insertText(insert, start, end);
    };
}
export default class Punctuation extends Extension {
    get name() {
        return 'punctuation';
    }
    inputRules() {
        return [
            new InputRule(/[^-|<]+(--)$/, punctuationHandler("–")),
            new InputRule(/[^-|<]+(–-)$/, punctuationHandler("—")),
            new InputRule(/-->$/, "⟶"),
            new InputRule(/->$/, "→"),
            new InputRule(/<--$/, "⟵"),
            new InputRule(/<-$/, "←"),
            new InputRule(/–>$/, "⟶"),
            new InputRule(/←-$/, "⟵"),
            new InputRule(/[0-9]+(x)[0-9]+$/, punctuationHandler("×")),
            new InputRule(/\.\.\.$/, "…"),
        ];
    }
}
