import type { en } from '@/i18n/translations/en';

export type Messages = typeof en;

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : DeepPartial<T[K]>;
};

/** Shape every non-English translation file must satisfy. Missing keys fall back to English. */
export type LocaleMessages = DeepPartial<Messages>;

type Join<P extends string, K extends string> = P extends '' ? K : `${P}.${K}`;

/** Dot-path keys that resolve to a string, e.g. "nav.home". */
export type MessageKey<T = Messages, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? Join<P, K>
    : T[K] extends readonly unknown[]
      ? never
      : MessageKey<T[K], Join<P, K>>;
}[keyof T & string];

/** Dot-path keys that resolve to a string list, e.g. "about.values". */
export type MessageListKey<T = Messages, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends readonly string[]
    ? Join<P, K>
    : T[K] extends string
      ? never
      : MessageListKey<T[K], Join<P, K>>;
}[keyof T & string];

/** Content dictionary: hash of the English source string -> translated string. */
export type ContentDictionary = Record<string, string>;

export type InterpolationValues = Record<string, string | number>;
