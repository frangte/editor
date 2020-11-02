import Mark from './Mark';
import { InputRule } from "prosemirror-inputrules"
import { toggleMark } from "prosemirror-commands";
import { Plugin } from "prosemirror-state";
import getMarkAttrs from "../utils/getMarkAttrs"
import { removeMark } from "../commands";
import type { Mark as PMMark, MarkSpec } from "prosemirror-model";
import { EditorView } from 'prosemirror-view';

function isPlainURL(link, parent, index, side) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false
  const content = parent.child(index + (side < 0 ? -1 : 0))
  if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false
  if (index == (side < 0 ? 1 : parent.childCount - 1)) return true
  const next = parent.child(index + (side < 0 ? -2 : 1))
  return !link.isInSet(next.marks)
}

export default class Link extends Mark {

  get name() {
    return "link";
  }

  get defaultOptions() {
    return {
      onClickLink: (event: MouseEvent) => window.open((event.target as HTMLAnchorElement).href),
    };
  }

  get schema(): MarkSpec {
    return {
      attrs: { href: {}, title: {default: null}},
      inclusive: false,
      parseDOM: [{tag: "a[href]", getAttrs(dom: HTMLElement) { return {href: dom.getAttribute("href"), title: dom.getAttribute("title")} }}],
      toDOM(mark: PMMark) { let {href, title} = mark.attrs; return ["a", {href, title, rel: "noopener noreferrer nofollow"}, 0] },
    };
  }

  keys({markType}) {
    return {
      "Mod-k": (state, dispatch) => {
        return toggleMark(markType, { href: "" })(state, dispatch);
      },
    }
  }

  commands({markType}) {
    return ({ href } = { href: "" }) => toggleMark(markType, { href });
  }

  inputRules({markType}) {
    return [
      new InputRule(/\[\[([^|\s]+)[|\s]?([^|\s]+)?\]\]$/, (state, match, start, end) => {
        const [okay, href, text] = match;
        const {tr, schema} = state;
        if (okay) { // TODO: keep marks of pre-existing text.
          tr.replaceWith(start, end, schema.text(text || href));
          tr.addMark(start, start + (text || href).length, markType.create({href}));
        }
        return tr;
      }),
      new InputRule(/\[(.+|:?)]\((\S+)\)/, (state, match, start, end) => {
        const [okay, alt, href] = match;
        const { tr, schema} = state;
        if (okay) {
          tr.replaceWith(start, end, schema.text(alt));
          tr.addMark(start, start + alt.length, markType.create({ href }));
        }
        return tr
      }),
    ];
  }

  get plugins() {
    return [
      new Plugin({
        props: {

          handleDOMEvents: {
            mouseover: (view: EditorView, event: MouseEvent) => {
              if (event.target instanceof HTMLAnchorElement && this.options.onHoverLink)
                return this.options.onHoverLink(event);
              return false;
            },
          },
          
          // Opens href in new window when clicked.
          handleClick: (view, pos, event: MouseEvent) => {

            // Escape if target is not a link, or is in editing mode and regular left click.
            if (!(event.target instanceof HTMLAnchorElement)) return false;
            if (view.editable && !(event.altKey || event.button === 2)) return false;

            // Call handler if it exists otherwise default behavior do nothing.
            if (!this.options.onClickLink) return false;
            event.stopPropagation();
            event.preventDefault();
            this.options.onClickLink(event);
            return true;
          },
          
          // Adds linkMark to selected text nodes if slice only has text link.
          handlePaste: (view, event, slice) => {

            const getLink = hasFragment => {
              const {content : {content}} = hasFragment
              const [child] = content
              // Child is TextNode from address bar.
              if (content.length == 1 && child.isText)
                try { new URL(child.text); return child.text } catch(error) { return false }
              // Child is Node from "copy link address".
              if (content.length == 1 && child.isTextblock)
                return getLink(child)
              return false
            }

            const validURL = getLink(slice)
            if (validURL)
              {
                // Add link to all children within current selection.
                // Implementation based off toggleMark from prosemirror-commands.
                const {schema, selection, tr} = view.state
                const {empty, ranges} = selection
                if (empty) return false

                for (let i = 0; i < ranges.length; i++) {
                  const {$from, $to} = ranges[i]
                  tr.addMark($from.pos, $to.pos, schema.marks.link.create({ href: validURL }))
                }
                view.dispatch(tr.scrollIntoView())
                return true
              }
            // Return if pasted text is not valid URL.
            return false
          }
        }
      })
    ]
  }

  get toMarkdown() {
    return {
      open(_state, mark, parent, index) {
        return isPlainURL(mark, parent, index, 1) ? "<" : "["
      },
      close(state, mark, parent, index) {
        return isPlainURL(mark, parent, index,-1) ? ">" : "](" 
          + state.esc(mark.attrs.href) + (mark.attrs.title ? " " + state.quote(mark.attrs.title) : "") + ")"
      },
    };
  }

  parseMarkdown() {
    return {
      mark: "link",
      getAttrs: tok => ({
        href: tok.attrGet("href"),
        title: tok.attrGet("title") || null,
      }),
    };
  }
}
