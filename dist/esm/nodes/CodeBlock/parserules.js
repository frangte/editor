export default [
    {
        tag: "pre",
        preserveWhitespace: "full",
        getAttrs(node) {
            console.log("hljsParseDom", node.getAttribute("class"));
            let match = /lang-([a-z]*)/.exec(node.getAttribute("class"));
            if (match && match[1]) {
                let smatch = /hljs ([a-z]*)/.exec(node.getAttribute("class"));
                return { lang: smatch ? smatch[1] : match[1] };
            }
            return {};
        }
    },
    { tag: "div.highlight", getAttrs(dom) {
            const match = /highlight highlight-source-([a-z]*)/.exec(dom.getAttribute("class"));
            return match[1] && { lang: match[1] };
        }, preserveWhitespace: "full" },
];
