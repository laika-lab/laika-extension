;(() => {
  window.laika = {
    send: (config) =>
      new Promise((resolve, reject) => {
        function handleMessage(ev) {
          if (ev.source !== window || !ev.data) {
            return
          }

          if (ev.data.type === "LAIKA_RESPONSE") {
            resolve(ev.data)
            window.removeEventListener("message", handleMessage)
          }
        }
        window.addEventListener("message", handleMessage)
        window.postMessage(
          {
            type: "LAIKA_REQUEST",
            config,
          },
          "*"
        )
      }),
  }
})()
