import { Reducer, ReactNode } from 'react'

export type StateAction = { type: string } & Record<string, any>
export type StateActionCases<S> = { [actionType: string]: Reducer<S, any> }
export type StateProviderHelpers<H> = H & { action: (action: string, payload: any) => void }
export interface StateProviderProps {
  children: ReactNode | ReactNode[]
}
