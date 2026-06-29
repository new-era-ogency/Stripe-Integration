declare module "youtube-transcript-api" {
  import type { AxiosRequestConfig } from "axios"

  export default class TranscriptClient {
    ready: Promise<void>
    constructor(axiosOptions?: AxiosRequestConfig)
    getTranscript(id: string, config?: AxiosRequestConfig): Promise<unknown>
    bulkGetTranscript(ids: string[], config?: AxiosRequestConfig): Promise<unknown[]>
  }
}
