import Extension from "../extensions/Extension";
export default class Node extends Extension {
    constructor(options) {
        super(options);
    }
    get type() {
        return "node";
    }
    get markdownToken() {
        return "";
    }
    toMarkdown(state, node) {
        console.error("toMarkdown not implemented", state, node);
    }
    parseMarkdown() {
        return;
    }
}
