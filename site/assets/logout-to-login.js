(() => {
  "use strict";
  document.addEventListener("click", event => {
    const target = event.target.closest?.("a,button");
    if (!target) return;
    const text = target.textContent.replace(/\s+/g, "");
    const href = target.getAttribute("href") || "";
    if (text.includes("退出登录") || text === "退出" || text.includes("返回首页") || href === "/logout") {
      event.preventDefault();
      event.stopImmediatePropagation();
      sessionStorage.removeItem("donggaAuthenticated");
      location.href = "/";
    }
  }, true);
})();
