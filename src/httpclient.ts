import {
  isJsonRpcErrorResponse,
  JsonRpcRequest,
  JsonRpcSuccessResponse,
  parseJsonRpcResponse,
} from "@cosmjs/json-rpc"
import axios from "axios"

export interface RpcClient {
  readonly execute: (request: JsonRpcRequest) => Promise<JsonRpcSuccessResponse>
  readonly disconnect: () => void
}

export function hasProtocol(url: string): boolean {
  return url.search("://") !== -1
}

export async function http(
  method: "POST",
  url: string,
  headers: Record<string, string> | undefined,
  request?: any
): Promise<any> {
  return axios
    .request({ url: url, method: method, data: request, headers: headers })
    .then((res) => res.data)
}

export interface HttpEndpoint {
  readonly url: string
  readonly headers: Record<string, string>
}

export class HttpClient implements RpcClient {
  protected readonly url: string
  protected readonly headers: Record<string, string> | undefined

  public constructor(endpoint: string | HttpEndpoint) {
    if (typeof endpoint === "string") {
      this.url = hasProtocol(endpoint) ? endpoint : "http://" + endpoint
    } else {
      this.url = endpoint.url
      this.headers = endpoint.headers
    }
  }

  public disconnect(): void {}

  public async execute(
    request: JsonRpcRequest
  ): Promise<JsonRpcSuccessResponse> {
    const response = parseJsonRpcResponse(
      await http("POST", this.url, this.headers, request)
    )
    if (isJsonRpcErrorResponse(response)) {
      throw new Error(JSON.stringify(response.error))
    }
    return response
  }
}
