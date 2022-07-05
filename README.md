# Yet Another Helper Library for React
A simple library to make using React Context + Reducer easer.

## Code Examples
```js
import { createStateProvider } from 'ya-react-context-reducer'
import { fetchCurrentUser } from '../api'

export const actions = {
    APP_INITIALIZE: 'initialized',
    SET_USER: 'user',
}

const initialState = {
    [actions.APP_INITIALIZE]: false,
    [actions.SET_USER]: null,
}

export const [Context, StateProvider] = createStateProvider({
    initialState,
    actions,
    providerHelpers: (dispatch) => ({
        /**
         * Helper function that reduces effort to call Reducer dispatch function.
         *
         * @param {string} action
         * @param {*} payload
         * @returns {void}
         */
        dispatchAction: function (action, payload) {
            return dispatch({ type: action, [action]: payload })
        },

        /**
         * Initialize user globally.
         *
         * @returns {void}
         */
        initializeUser: function () {
            fetchCurrentUser().then((response) => {
                if (response.status === 200 && response.data.user) {
                    this.setUser(response.data.user)
                }
                this.dispatchAction(actions.APP_INITIALIZE, true)
            })
        },

        /**
         * Set user globally.
         *
         * @param {*} user
         * @returns {void}
         */
        setUser: function (user) {
            return this.dispatchAction(actions.SET_USER, user)
        },
    }),
})
```
Then wrap your `App` with the `StateProvider`:
```jsx
import { StateProvider } from './context'
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<StateProvider><App tab="home" /></StateProvider>);
```

After that you may `useContext` within a component object destructure `state`/`dispatch`/`helpers`:
```jsx
import { actions, Context } from '../../context'

export function UserExample() {
    const { state, helpers, dispatch } = useContext(Context)

    helpers.setUser(null)
    state.user
    this.dispatchAction(actions.SET_USER, { id: 123, name: 'John Doe' })
    return <h1>{state.user.name}</>
}
```
