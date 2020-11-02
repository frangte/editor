import Extension from './Extension'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { TextSelection } from "prosemirror-state";
import type { Node as PMNode } from "prosemirror-model";

export default class Placeholder extends Extension {

  get name() {
    return 'placeholder';
  }

  get defaultOptions() {
    return {
      emptyNodeClass: 'ProseMirror-emptynode',
      activeNodeClass: 'ProseMirror-activenode',
      cursorNodeClass: 'ProseMirror-cursornode',
      showOnlyWhenEditable: true,
    };
  }

  get update() {
    console.log("update")
    return view => view.updateState(view.state);
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          decorations: ({ doc, selection }: {doc: PMNode, selection: TextSelection}): DecorationSet => {

            const { from, to, $cursor } = selection
            const decorations: Decoration[] = []

            const getDecorations = (node: PMNode, pos: number) => {
              if (node.isBlock === false) return false;
              const classes: string[] = []

              // Check if selection intersects with this node.
              const hasSelection = pos <= to && from <= pos + node.nodeSize
              const isEmpty = node.textContent.length === 0
              const hasCursor = $cursor && pos <= $cursor.pos && $cursor.pos <= pos + node.nodeSize;
              
              hasSelection && classes.push(this.options.activeNodeClass)
              isEmpty && classes.push(this.options.emptyNodeClass)
              hasCursor && classes.push(this.options.cursorNodeClass)
              
              if (classes.length !== 0)
                decorations.push(Decoration.node(pos, pos + node.nodeSize, {'class': classes.join(' ')}));

              // recurse only on block nodes
              return node.isBlock; 
            }

            doc.descendants(getDecorations);
            return DecorationSet.create(doc, decorations);
          },
          attributes(state) {
            const isEmpty = state.doc.textContent.length === 0
            return isEmpty ? {class: "ProseMirror-emptydoc"} : null;
          }
        },
      }),
    ]
  }
}
