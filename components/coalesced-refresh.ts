// Coalesce overlapping invalidations. The existing API remains the source of truth.
export function createCoalescedRefresh<T>(
  load: (signal: AbortSignal) => Promise<T>,
  apply: (value: T) => void,
  onError: (error: unknown) => void,
) {
  let active = true
  let running = false
  let pending = false
  let controller: AbortController | undefined

  async function drain() {
    running = true
    try {
      while (active && pending) {
        pending = false
        controller = new AbortController()
        try {
          const value = await load(controller.signal)
          if (active) apply(value)
        } catch (error) {
          if (active) onError(error)
        }
      }
    } finally {
      controller = undefined
      running = false
    }
  }

  return {
    request() {
      if (!active) return
      pending = true
      if (!running) void drain()
    },
    stop() {
      active = false
      pending = false
      controller?.abort()
    },
  }
}
