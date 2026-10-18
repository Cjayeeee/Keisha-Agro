/** True when a content value is still a [placeholder]. */
export const isPlaceholder = (v: string) => !v || v.trim().startsWith('[')
