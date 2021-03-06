import { wrapIn, lift } from 'prosemirror-commands';
import { nodeIsActive } from '../utils';
export default function toggleWrap(type) {
    return (state, dispatch, view) => {
        const isActive = nodeIsActive(state, type);
        if (isActive)
            return lift(state, dispatch);
        return wrapIn(type)(state, dispatch);
    };
}
