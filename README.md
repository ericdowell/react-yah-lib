# Yet Another React Context Reducer
A simple library to make using React Context + Reducer easer.

## Code Examples
```js
import { fetchCurrentUser } from '../api'

export const actions = {
    APP_INITIALIZE: 'initialized',
    SET_USER: 'user',
}

export const [Context, StateProvider] = createStateProvider({
    initialState: {
        [actions.APP_INITIALIZE]: false,
        [actions.SET_USER]: null,
    },
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