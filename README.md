# Yet Another Helper Library for React
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ericdowell/react-yahl/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/ericdowell/react-yahl/tree/main)
[![npm version](https://img.shields.io/npm/v/react-yahl.svg?style=flat-square)](https://www.npmjs.com/package/react-yahl)
[![npm downloads](https://img.shields.io/npm/dm/react-yahl.svg?style=flat-square)](http://npm-stat.com/charts.html?package=react-yahl)

A simple library to make using React things easier, e.g. making Context + Reducer setup, state and dispatching.

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
         * Initialize user globally.
         *
         * @returns {void}
         */
        initializeUser: function () {
            fetchCurrentUser().then((response) => {
                if (response.status === 200 && response.data.user) {
                    this.setUser(response.data.user)
                }
                this.action(actions.APP_INITIALIZE, true)
            })
        },

        /**
         * Set user globally.
         *
         * @param {*} user
         * @returns {void}
         */
        setUser: function (user) {
            this.action(actions.SET_USER, user)
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

After that you may `useContext` within a component object destructure `state`/`dispatch`/`helpers`.

Note that `helpers` also contains a `action` function to help shorten the usage of the normal reducer `dispatch` function.
```jsx
import { useEffect } from 'react'
import { actions, Context } from '../../context'

export function UserExample() {
    // The different options to (object) destructure from the context.
    const { state, helpers, dispatch } = useContext(Context)

    // Just showing the different things someone can do.
    helpers.setUser(null)
    helpers.action(actions.SET_USER, { id: 123, name: 'John Doe' })
    helpers.action(actions.APP_INITIALIZE, true)

    useEffect(() => {
        window.console.log('app initialized', state.initialized)
        window.console.log('user', state.user)
    }, [state.initialized, state.user])
    
    return <h1>{state.user.name}</>
}
```
