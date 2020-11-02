import Mark from './Mark';
import markInputRule from '../commands/markInputRule';
import { toggleMark } from "prosemirror-commands";
import type { MarkSpec } from "prosemirror-model";

export default class Highlight extends Mark {

  get name() {
    return 'mark'
  }

  get schema(): MarkSpec {
    return {
      parseDOM: [{tag: "mark"}],
      toDOM() { return ["mark", 0] },
    }
  }

  keys({markType}) {
    return {
      'Mod-h': toggleMark(markType),
    }
  }

  inputRules({markType}) {
    return [
      markInputRule(/(?:#)([^#\s]+(?:\s+[^#\s]+)*)(?:#)$/, markType),
    ]
  }

  get toMarkdown() {
    return {
      open: "==",
      close: "==",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "mark" };
  }
}