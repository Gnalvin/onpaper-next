export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false
  return e instanceof Element
}

export const isString = (e: unknown) => typeof e == 'string'

export const isDocument = (e: unknown): e is Document => {
  if (e instanceof Document) return true
  return false
}

export function isWindow(e: unknown): e is Window {
  if (typeof window.constructor !== 'undefined') {
    return e instanceof window.constructor
  } else {
    return (e as Window).window === e
  }
}
export const isFunction = (val: unknown) => typeof val === 'function'
