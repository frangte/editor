import Extension from './Extension'
import { InputRule } from "prosemirror-inputrules"

// Replaces punctuation and keeps nearby text.
function punctuationHandler(string) {
  return (state, match, start, end) => {
    const insert = match[0].replace(new RegExp(`${match[1]}`, 'g'), string)
    return state.tr.insertText(insert, start, end)
  }
}

export default class Punctuation extends Extension {

  get name() {
    return 'punctuation'
  }

  inputRules() {
    return [
      new InputRule(/[^-|<]+(--)$/, punctuationHandler("–")), // en dash
      new InputRule(/[^-|<]+(–-)$/, punctuationHandler("—")), // em dash

      new InputRule(/-->$/, "⟶"), // long right arrow
      new InputRule(/->$/, "→"), // right arrow
      new InputRule(/<--$/, "⟵"), // long left arrow
      new InputRule(/<-$/, "←"), // left arrow

      new InputRule(/–>$/, "⟶"), // long right arrow
      new InputRule(/←-$/, "⟵"), // long left arrow

      new InputRule(/[0-9]+(x)[0-9]+$/, punctuationHandler("×")),
      new InputRule(/\.\.\.$/, "…"), // ellipsis
    ];
  }
}