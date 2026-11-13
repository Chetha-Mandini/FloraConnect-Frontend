/* Runs independently of React and hashed bundles so script failures cannot leave
   an empty screen. The only stored value is a reload timestamp, never auth data. */
(function () {
  const reloadKey = "floraconnect:asset-reload";
  let recovering = false;
  function showRecovery(code) {
    if (document.getElementById("app-startup-recovery")) return;
    const panel = document.createElement("div");
    panel.id = "app-startup-recovery";
    panel.dataset.diagnostic = code;
    panel.setAttribute("role", "alert");
    panel.style.cssText =
      "position:fixed;inset:0;z-index:99999;padding:40px;background:#f7f9f6;color:#202720;font:16px/1.6 system-ui,sans-serif;overflow:auto";
    const heading = document.createElement("h1");
    heading.textContent = "FloraConnect could not finish opening";
    const message = document.createElement("p");
    message.textContent =
      "Reload the page to load the current application version. If it still fails, share the diagnostic code below.";
    const diagnostic = document.createElement("p");
    diagnostic.textContent = "Diagnostic: " + code;
    const reload = document.createElement("button");
    reload.textContent = "Reload page";
    reload.addEventListener("click", function () {
      window.location.reload();
    });
    const login = document.createElement("a");
    login.href = "/login";
    login.textContent = "Return to login";
    login.style.marginLeft = "20px";
    panel.append(heading, message, diagnostic, reload, login);
    document.body.append(panel);
  }
  function recoverAsset() {
    if (recovering) return;
    recovering = true;
    try {
      const previous = Number(sessionStorage.getItem(reloadKey) || 0);
      if (Date.now() - previous > 5 * 60 * 1000) {
        sessionStorage.setItem(reloadKey, String(Date.now()));
        window.location.reload();
        return;
      }
    } catch {
      /* Storage may be disabled. Show recovery without a reload loop. */
    }
    showRecovery("ASSET_LOAD_FAILED");
  }
  window.addEventListener("vite:preloadError", function (event) {
    event.preventDefault();
    recoverAsset();
  });
  window.addEventListener(
    "error",
    function (event) {
      const target = event.target;
      if (target instanceof HTMLScriptElement && target.src) {
        const url = new URL(target.src, window.location.href);
        if (url.origin === window.location.origin) recoverAsset();
      }
    },
    true,
  );
  function checkContent() {
    const root = document.getElementById("root");
    if (root && !root.childElementCount) {
      showRecovery("APP_RENDER_EMPTY");
    } else if (root && root.querySelector("[data-app-startup]")) {
      showRecovery("APP_STARTUP_INCOMPLETE");
    }
    const main = root && root.querySelector("main");
    if (
      main &&
      (window.getComputedStyle(main).visibility === "hidden" ||
        main.getBoundingClientRect().height === 0)
    ) {
      showRecovery("APP_CONTENT_HIDDEN");
    } else if (main) {
      const panel = document.getElementById("app-startup-recovery");
      if (panel && panel.dataset.diagnostic === "APP_CONTENT_HIDDEN")
        panel.remove();
    }
  }
  window.setInterval(checkContent, 2000);
  const root = document.getElementById("root");
  if (root)
    new MutationObserver(function () {
      if (!root.childElementCount)
        window.setTimeout(function () {
          if (!root.childElementCount) showRecovery("APP_RENDER_EMPTY");
        }, 1500);
      const panel = document.getElementById("app-startup-recovery");
      if (
        panel &&
        [
          "APP_STARTUP_INCOMPLETE",
          "APP_RENDER_EMPTY",
          "APP_CONTENT_HIDDEN",
        ].includes(panel.dataset.diagnostic) &&
        root.childElementCount &&
        !root.querySelector("[data-app-startup]") &&
        (!root.querySelector("main") ||
          (root.querySelector("main").getBoundingClientRect().height > 0 &&
            window.getComputedStyle(root.querySelector("main")).visibility !==
              "hidden"))
      )
        panel.remove();
    }).observe(root, { childList: true, subtree: true });
})();
