import { HttpClient } from "./httpclient"

const handleSend = async ({ client, req }: any): Promise<any> => {
  const rpcClient = new HttpClient(client.url)
  const data = await rpcClient.execute(req)

  return { messageType: "receive", data }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.messageType === "send") {
    handleSend(message.data).then(sendResponse)
    return true
  }
})

chrome.tabs.onUpdated.addListener((id, _info, tab) => {
  if (tab.status !== "loading") {
    chrome.tabs.executeScript(tab.id, {
      file: "contentscript.js",
    })
  }
})
