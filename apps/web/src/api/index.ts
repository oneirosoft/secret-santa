import { treaty } from "@elysiajs/eden";
import type { Api } from "@secret-santa/api"

type ApiClientOptions = {
    baseUrl: string
}

const createClient = (options: ApiClientOptions) => treaty<Api>(options.baseUrl)

export {
    createClient
}
