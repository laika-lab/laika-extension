const fs = require("fs")

window.addEventListener("message", (e) => {
  if (e.source !== window || !e.data) {
    return
  }

  if (e.data.type === "LAIKA_REQUEST") {
    chrome.runtime.sendMessage(
      {
        messageType: "send",
        data: e.data.config,
      },
      (message) => {
        window.postMessage(
          {
            type: "LAIKA_RESPONSE",
            response: message.data,
          },
          "*"
        )
      }
    )
  }
})

async function injectLaikaHook() {
  const script = document.createElement("script")
  script.textContent = fs.readFileSync(__dirname + "/hook.js", {
    encoding: "utf-8",
  })
  document.documentElement.appendChild(script)
  script.parentNode.removeChild(script)
}

injectLaikaHook()
