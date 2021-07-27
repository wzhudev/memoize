import { exactEqual } from './utils'

// TODO@wendellhu: this type is not deal well
export type CacheKeyFn<U> = (...args: any[]) => string

export function memoizeFunc<T extends (...args: any[]) => any>(
    fn: T,
    cacheKeyFn?: CacheKeyFn<Parameters<T>>
): T {
    let hasRun = false
    let newParams: Parameters<T>

    const cachedLastValue = new Map<string, ReturnType<T>>()
    const cachedLastParams = new Map<string, Parameters<T>>()

    const wrapped = function(...args: Parameters<T>) {
        const key = cacheKeyFn?.(...args) || 'only'

        newParams = args

        const lastParams = cachedLastParams.get(key) || []

        let lastValue
        if (!hasRun) {
            hasRun = true
            lastValue = fn(...args)
            cachedLastParams.set(key, newParams)
            cachedLastValue.set(key, lastValue!)
        } else if (!exactEqual(lastParams, newParams)) {
            lastValue = fn(...args)
            cachedLastParams.set(key, newParams)
            cachedLastValue.set(key, lastValue!)
        } else {
            lastValue = cachedLastValue.get(key)!
        }

        return lastValue
    }

    return wrapped as T
}
