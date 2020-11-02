import { insertText } from '../commands'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

/**
 * Create a matcher that matches when a specific character is typed.
 * Used for @mentions and #tags.
 * @param {Regex} regexp
 * @returns {match}
 */
function positionMatcher(regexp: RegExp, position) {
  const text = position.doc.textBetween(position.before(), position.end(), '\0', '\0');
  let match;
  if ((match = regexp.exec(text)) !== null) {
    // The absolute position of the match in the document
    const from = match.index + position.start()
    let to = from + match[0].length

    // Edge case: if spaces are allowed and we're directly in between two triggers
    /*
    if (allowSpaces && suffix.test(text.slice(to - 1, to + 1))) {
      match[0] += ' '
      to++;
    }
    */

    // If the position is located within the matched substring, return that range
    if (from < position.pos && to >= position.pos)
      return {range: {from, to }, query: match[1], text: match[0]}
  }
}

export default function Autocomplete({matcher, appendText, suggestionClass,
  command, onEnter, onChange, onLeave, onKeyDown, onFilter}) {
  return new Plugin({
    key: new PluginKey('Autocomplete'),
    view() {
      return {
        update: (view, prevState) => {
          const prev = this.key.getState(prevState)
          const next = this.key.getState(view.state)

          // See how the state changed
          const moved   =  prev.active &&  next.active && prev.range.from !== next.range.from
          const started = !prev.active &&  next.active
          const stopped =  prev.active && !next.active
          const changed = !started     && !stopped     && prev.query      !== next.query

          const handleStart  = started ||  moved
          const handleChange = changed && !moved
          const handleExit   = stopped ||  moved

          // Cancel when suggestion isn't active
          if (!handleStart && !handleChange && !handleExit)
            return

          const state = handleExit ? prev : next
          const decorationNode = document.querySelector(`.${suggestionClass}`)

          console.log(handleStart, handleChange, handleExit)
          onFilter(state.query)

          const props = {
            view,
            range: state.range,
            query: state.query,
            text: state.text,
            decorationNode,
            command: ({ range, attrs }) => {
              command({
                range,
                attrs,
                schema: view.state.schema,
              })(view.state, view.dispatch, view)

              if (appendText) insertText(appendText)(view.state, view.dispatch)
            },
          }

          // Trigger the hooks when necessary
          handleExit && onLeave(props)
          handleChange && onChange(props)
          handleStart && onEnter(props)
        },
      }
    },

    state: {

      init() {
        return { active: false, decorationId: null, range: {}, query: null, text: null }
      },

      apply(tr, prev) {
        const { selection: { $from, from, to } } = tr
        let next = { ...prev, active: false, decorationId: null, range: {}, query: null, text: null}

        if (from == to && !$from.parent.type.spec.code) {
          const match = positionMatcher(matcher, $from)
          if (match) {
            next = {...next, active: true, ...match};
            next.decorationId = prev.decorationId ? prev.decorationId : "suggestion"
          }
        }

        return next
      },
    },

    props: {

      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        const { active, range, decorationNode } = this.getState(view.state)
        if (!active) return false
        const handle = onKeyDown({ view, event, range, decorationNode })
        console.log("active", active, handle)
        return handle
      },

      // Setup decorator on active suggestion.
      decorations(editorState) {
        const { active, range, decorationId } = this.getState(editorState)
        if (!active) return null

        return DecorationSet.create(editorState.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: 'span', class: `ProseMirror-autocomplete ${suggestionClass}`
          }),
        ])
      },
    },
  })
}