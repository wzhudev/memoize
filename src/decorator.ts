import { CacheKeyFn } from './fn'
import { exactEqual } from './utils'

let memoizeId = 0

export function memoize(cacheKeyFn?: CacheKeyFn<any>) {
    return function(_target: any, key: string, descriptor: any): any {
        const memoizePrefix = `memoize:${memoizeId++}`

        let fnKey: string
        let fn: any
        let hasRun = false
        let newParams: any[] = []

        const cachedLastValue = new Map<string, any>()
        const cachedLastParams = new Map<string, any>()

        // memoize on methods
        if (typeof descriptor.value === 'function') {
            fnKey = 'value'
            fn = descriptor.value
        } else if (typeof descriptor.get === 'function') {
            // memoize on getters
            fnKey = 'get'
            fn = descriptor.get
        } else {
            throw new Error(
                'decorated memoize on properties or methods'
            )
        }

        if (typeof descriptor.set === 'function') {
            const rawSetter = descriptor.set
            descriptor.set = function(...args: any[]) {
                hasRun = false // intercept setter to mark getter as refreshed
                rawSetter!.apply(this, args)
            }
        }

        const memoizeKey = `${memoizePrefix}:${key}`

        // override original method or getter
        descriptor[fnKey] = function(...args: any[]) {
            const _self = this // the instance
            newParams = args;

            const methodUpdater = function() {
                const key = cacheKeyFn?.(newParams) || 'only'
                const lastParams = cachedLastParams.get(key) || []

                let lastValue
                if (!hasRun) {
                    hasRun = true
                    lastValue = fn.apply(_self, newParams)
                    cachedLastValue.set(key, lastValue)
                    cachedLastParams.set(key, newParams)
                } else if (!exactEqual(newParams, lastParams)) {
                    lastValue = fn.apply(_self, newParams)
                    cachedLastValue.set(key, lastValue)
                    cachedLastParams.set(key, newParams)
                } else {
                    lastValue = cachedLastValue.get(key)
                }

                return lastValue
            }

            const getterUpdater = function() {
                let lastValue
                if (!hasRun) {
                    lastValue = fn.apply(_self)
                    hasRun = true
                    cachedLastValue.set(key, lastValue!)
                } else {
                    lastValue = cachedLastValue.get(key)!
                }

                return lastValue
            }

            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: false,
                    enumerable: false,
                    get: fnKey === 'value' ? methodUpdater : getterUpdater
                })
            }
            return this[memoizeKey]
        }
    }
}
