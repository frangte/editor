import { setBlockType } from 'prosemirror-commands'
import { nodeIsActive } from '../utils'

export default function toggleBlockType(type, toggletype, attrs = {}) {
  return (state, dispatch, view) => {
    const isActive = nodeIsActive(state, type, attrs)
    if (isActive) return setBlockType(toggletype)(state, dispatch)
    return setBlockType(type, attrs)(state, dispatch)
  }
}
