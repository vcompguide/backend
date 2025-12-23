export type OmitMethod<ObjType extends object> = {
    [key in keyof ObjType as ObjType[key] extends (...params: any[]) => any ? never : key]: PlainOrOmitMethod<
        ObjType[key]
    >;
};

type PlainOrOmitMethod<Value> = Value extends (infer ArrayElement)[]
    ? PlainOrOmitMethod<ArrayElement>[]
    : Value extends Date | string | number | boolean | null | undefined | bigint
      ? Value
      : Value extends object
        ? OmitMethod<Value>
        : Value;
