export interface State {
  count: number;
}

export interface IGetters {
  double: number;
  expo2: number;
  expo: (amount: number) => number;
}
export interface IRootGetters {
  'counter/double': IGetters['double'];
  'counter/expo2': IGetters['expo2'];
  'counter/expo': IGetters['expo'];
}

export interface IMutations {
  setCount: { amount: number };
  multi: number;
  increment: void;
}
export interface IRootMutations {
  'counter/setCount': IMutations['setCount'];
  'counter/multi': IMutations['multi'];
  'counter/increment': IMutations['increment'];
}

export interface IActions {
  asyncSetCount: { amount: number };
  asyncMulti: number;
  asyncIncrement: void;
}
export interface IRootActions {
  'counter/asyncSetCount': IActions['asyncSetCount'];
  'counter/asyncMulti': IActions['asyncMulti'];
  'counter/asyncIncrement': IActions['asyncIncrement'];
}
