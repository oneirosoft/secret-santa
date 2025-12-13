import { treaty } from "@elysiajs/eden"
import type { Api } from "@secret-santa/api"
import appSettings from "@/appsettings.json"

type ApiClientOptions = {
    baseUrl?: string
}

const createClient = (options?: ApiClientOptions) => {
    const baseUrl = options?.baseUrl ?? appSettings.baseUrl
    return treaty<Api>(baseUrl)
}

export { createClient }
