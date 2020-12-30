declare module 'redux-dispatcher' {
  import { Reducer, Action } from 'redux';
  import { TakeableChannel } from 'redux-saga';

  interface Syn<K extends string> {
    <S>(initialState: S, reducer: { [T: string]: Partial<S> | ((state: S, payload: any) => S) }): {
      [key in K]: Reducer<S>;
    };
  }

  function synthesize<M, K extends string>(
    key: K,
    mapDispatchToAC: M,
  ): {
    [D in keyof M]: M[D] & Function & (() => any) & string & TakeableChannel<any> & Action<string>;
  } &
    Syn<K>;
}
