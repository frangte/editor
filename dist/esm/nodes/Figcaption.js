import Node from './Node';
export default class Figcaption extends Node {
    get name() {
        return "figcaption";
    }
    get schema() {
        return {
            content: "inline*",
            group: "figure",
            parseDOM: [{ tag: "figcaption" }],
            toDOM: () => ["figcaption", 0],
        };
    }
}
