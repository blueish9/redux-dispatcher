declare module 'redux-dispatcher' {
  import { Reducer, Action } from 'redux';
  import { TakeableChannel } from 'redux-saga';

  interface Syn<K extends string> {
    <S>(initialState: S, reducer: { [T: string]: Partial<S> | ((state: S, payload: any) => S) }): {
      [key in K]: Reducer<S>;
    };
  }

  class PromiseResult {
    $result: any;
  }

  type Fnc = (...args: any[]) => any;

  type ActionWithPromise<D extends Fnc> = (...args: Parameters<D>) => ReturnType<D> & PromiseResult;

  type DispatchToAC = Record<string, Fnc & any>;

  function synthesize<M extends DispatchToAC, K extends string>(
    key: K,
    mapDispatchToAC: M,
  ): {
    [D in keyof M]: ActionWithPromise<M[D]> & string & TakeableChannel<any> & Action<string>;
  } &
    Syn<K>;
}
