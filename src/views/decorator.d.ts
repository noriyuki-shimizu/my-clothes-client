export namespace Decorator {
  export interface Rule {
    enum: string;
    len: number;
    max: number;
    message: string;
    min: number;
    pattern: RegExp;
    required: boolean;
    transform: (value: any) => any;
    type: string;
    validator: (rule: Partial<Rule>, value: any, callback: Function) => void;
    whitespace: boolean;
  }

  export interface Options {
    getValueFromEvent: (e: Event) => any;
    getValueProps: (value: any) => object;
    initialValue: any;
    normalize: (value: any[], prevValue: any[]) => any;
    preserve: boolean;
    rules: Partial<Rule>[];
    trigger: string;
    validateFirst: boolean;
    validateTrigger: string | string[];
    valuePropName: string;
  }

  export interface FieldParameters {
    [k: string]: [string, Partial<Options>];
  }
}
