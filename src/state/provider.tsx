import React, {
  Context,
  createContext,
  Dispatch,
  ProviderProps,
  ReactElement,
  Reducer,
  ReducerAction,
  useReducer,
} from 'react'
import { StateAction, StateActionCases, StateProviderProps } from './types'
import { applyReducerState } from './helpers'

export function createStateProvider<
  S,
  R extends Reducer<any, any>,
  A extends Record<string, string>,
  H extends Record<string, (...args: any[]) => any>,
>(options: {
  initialState: S
  actions: A
  actionCases?: StateActionCases<S>
  providerHelpers?: (dispatch: Dispatch<ReducerAction<R>>) => H
}): [
  Context<{
    dispatch: Dispatch<ReducerAction<R>>
    helpers: H & { action: (action: string, payload: any) => void }
    state: S
  }>,
  (props: StateProviderProps) => ReactElement<
    ProviderProps<{
      dispatch: Dispatch<ReducerAction<R>>
      helpers: H & { action: (action: string, payload: any) => void }
      state: S
    }>
  >,
] {
  type Helpers = H & { action: (action: string, payload: any) => void }
  type ReducerContextProps = {
    dispatch: Dispatch<ReducerAction<R>>
    helpers: Helpers
    state: S
  }
  if (!options.actions || typeof options.actions !== 'object' || Object.keys(options.actions).length === 0) {
    throw new Error("A valid 'actions' option must be provided.")
  }
  const availableActionTypes = Object.values(options.actions)
  const stringifyActions = JSON.stringify(availableActionTypes)
  const LocalContext = createContext<ReducerContextProps>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch: (value: any): void => undefined, // StateProvider will have correct Reducer dispatch function
    helpers: {}, // StateProvider will have correct helper functions
    state: options.initialState, // dispatch/state will be maintained by Reducer provided in StateProvider going forward
  } as ReducerContextProps)
  function StateProvider(props: StateProviderProps): ReactElement<ProviderProps<ReducerContextProps>> {
    const [state, dispatch] = useReducer((prevState: S, action: StateAction): any => {
      if (!availableActionTypes.includes(action.type)) {
        throw new Error(`Unknown action: "${action.type}", known actions: ${stringifyActions}`)
      }
      if (typeof options?.actionCases?.[action.type] !== 'function') {
        return applyReducerState(prevState, action)
      }
      return options.actionCases[action.type](prevState, action)
    }, options.initialState)
    const helpers: Helpers = {
      action: function (action: string, payload: any): void {
        dispatch({ type: action, [action]: payload })
      },
      ...((typeof options?.providerHelpers === 'function' ? options.providerHelpers(dispatch) : {}) as H),
    }
    return (
      <LocalContext.Provider
        value={{
          dispatch,
          helpers,
          state,
        }}
      >
        {props.children}
      </LocalContext.Provider>
    )
  }
  return [LocalContext, StateProvider]
}
