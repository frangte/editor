import Extension from "../Extension";
import SyntaxHighlightPlugin from "./syntax-highlight-plugin";
export default class SyntaxHighlight extends Extension {
    get name() {
        return "syntax-highlight";
    }
    get plugins() {
        return [SyntaxHighlightPlugin()];
    }
}
