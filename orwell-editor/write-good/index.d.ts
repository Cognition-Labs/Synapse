declare module 'write-good' {
  interface Suggestion {
    index: number
    offset: number
    reason: string
  }

  interface WriteGoodOptions {
    checks?: Record<string, any>
    whitelist?: string[]
    [key: string]: any
  }

  function writeGood(text: string, opts?: WriteGoodOptions): Suggestion[]

  export = writeGood
}
