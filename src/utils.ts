import type { 
  ArrayField, 
  ComponentConfig, 
  CustomField, 
  Field, 
  ObjectField, 
  PuckComponent, 
  RadioField, 
  SelectField, 
  Slot 
} from "@measured/puck";

type Overwrite<T, U> = Omit<T, keyof U> & U;

export function defineComponent<
  F extends NonNullable<ComponentConfig["fields"]>
>(
  config: Overwrite<ComponentConfig & { fields: F }, {
    render: PuckComponent<{
      [K in keyof F]: InferField<F[K]>
    }>
  }>
) {
  return config;
}

export type InferField<T extends Field> = (
  T["type"] extends "text" ? string :
  T["type"] extends "textarea" ? string :
  T["type"] extends "number" ? number :
  T["type"] extends "slot" ? Slot :
  T["type"] extends "external" ? any :
  T["type"] extends "array" ? InferArrayField<T> :
  T["type"] extends "object" ? InferObjectField<T> :
  T["type"] extends "select" ? InferSelectField<T> :
  T["type"] extends "radio" ? InferRadioField<T> :
  T["type"] extends "custom" ? InferCustomField<T> :
  any
);

type InferArrayField<T> = T extends ArrayField ? Array<{ [K in keyof T["arrayFields"]]: InferField<T["arrayFields"][K]> }> : never;

type InferObjectField<T> = T extends ObjectField ? { [K in keyof T["objectFields"]]: InferField<T["objectFields"][K]> } : never;

type InferSelectField<T> = T extends SelectField ? T["options"][number]["value"] : never;

type InferRadioField<T> = T extends RadioField ? T["options"][number]["value"] : never;

type InferCustomField<T> = T extends CustomField<infer V> ? V : never;