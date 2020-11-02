import Node from './Node';
const EmojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
export default class Emoji extends Node {
    get emoji() {
        return 'emoji';
    }
    get schema() {
        return {
            attrs: { unicode: { default: "" }, name: { default: "" } },
            content: "text",
            group: "inline",
            parseDOM: [],
            toDOM: (node) => ['span', { class: "emoji" }, 0],
        };
    }
}
