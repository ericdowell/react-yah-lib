import { Reducer, ReactNode } from 'react'

export type StateAction = { type: string } & Record<string, any>
export type StateActionCases<S> = { [actionType: string]: Reducer<S, any> }
export interface StateProviderProps {
  children: ReactNode | ReactNode[]
}
