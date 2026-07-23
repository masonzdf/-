(() => {
  "use strict";

  const sections = [
    { name: "主体工程标", code: "DG-SG-01", desc: "大坝、溢洪道及附属建筑物工程" },
    { name: "机电设备安装标", code: "DG-SG-02", desc: "机电设备采购、安装及调试工程" },
    { name: "工程建设监理标", code: "DG-JL-01", desc: "施工全过程质量、进度与安全监理" }
  ];
  const icons = {
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M7 3h4l2 5-3 2c1.5 3 3.5 5 6 6l2-3 4 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2z"/></svg>',
    code: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h2M11 9h2M15 9h2M7 13h5M14 13h3"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/></svg>',
    enter: '<svg viewBox="0 0 24 24"><path d="m10 7 5 5-5 5M15 12H3M16 4h4v16h-4"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>'
  };

  const appMarkup = `
    <div class="dg-login-shell">
      <section class="dg-login-hero">
        <div class="dg-login-brand">
          <p class="dg-login-eyebrow">DONGGA RESERVOIR · DIGITAL CONSTRUCTION</p>
          <h1>日喀则市东嘎水库工程智慧建管平台</h1>
          <p>Smart Construction Management Platform</p>
        </div>
        <div class="dg-login-visual"><img src="/images/construction-illustration.webp" alt="东嘎水库工程建设场景"></div>
      </section>
      <section class="dg-login-side">
        <div class="dg-login-card">
          <h2>用户登录</h2>
          <p>请输入登录信息验证身份</p>
          <div class="dg-login-tabs" role="tablist" aria-label="登录方式">
            <button class="dg-login-tab" type="button" role="tab" data-mode="account" aria-selected="true">账号密码</button>
            <button class="dg-login-tab" type="button" role="tab" data-mode="phone" aria-selected="false">手机验证码</button>
          </div>
          <form id="dg-login-form" novalidate>
            <div class="dg-login-panel" data-panel="account">
              ${field("账号", "username", "text", "请输入账号", icons.user, "username")}
              <div class="dg-field" data-field="password">
                <div class="dg-field-head"><label for="dg-password">密码</label></div>
                <div class="dg-input-wrap">${icons.lock}<input class="dg-input" id="dg-password" name="password" type="password" autocomplete="current-password" placeholder="请输入密码"><button class="dg-icon-button" type="button" id="dg-password-toggle" aria-label="显示密码">${icons.eye}</button></div>
                <p class="dg-field-error" aria-live="polite"></p>
              </div>
              <div class="dg-login-options"><label class="dg-checkbox"><input type="checkbox" id="dg-remember">记住账号</label><button type="button" class="dg-text-button" id="dg-forgot">忘记密码？</button></div>
            </div>
            <div class="dg-login-panel" data-panel="phone" hidden>
              ${field("手机号", "phone", "tel", "请输入11位手机号", icons.phone, "tel")}
              <div class="dg-field" data-field="code">
                <div class="dg-field-head"><label for="dg-code">验证码</label></div>
                <div class="dg-code-row">
                  <div class="dg-input-wrap">${icons.code}<input class="dg-input" id="dg-code" name="code" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="请输入6位验证码"></div>
                  <button class="dg-code-button" type="button" id="dg-send-code">获取验证码</button>
                </div>
                <p class="dg-field-error" aria-live="polite"></p>
              </div>
            </div>
            <button class="dg-login-submit" type="submit">${icons.enter}<span>登录</span></button>
          </form>
          <div class="dg-security">${icons.shield}<span>登录信息将被安全加密</span></div>
        </div>
      </section>
    </div>
    <footer class="dg-login-footer">© 2025 首筑网络技术（重庆）有限公司版权所有　渝公网安备50010602503931号　·　渝ICP备2022011679号　技术支持电话：023-6832970</footer>
    <div class="dg-overlay" id="dg-section-overlay" hidden>
      <section class="dg-section-modal" role="dialog" aria-modal="true" aria-labelledby="dg-section-title">
        <header class="dg-modal-head"><div><h3 id="dg-section-title">选择项目标段</h3><p>请选择本次进入系统需要管理的标段</p></div><button class="dg-modal-close" type="button" aria-label="关闭">×</button></header>
        <div class="dg-section-list">${sections.map((item, index) => `<label class="dg-section-option"><input type="radio" name="dg-section" value="${item.name}" ${index === 0 ? "checked" : ""}><span class="dg-section-copy"><strong>${item.name}</strong><small>${item.desc}</small></span><span class="dg-section-code">${item.code}</span></label>`).join("")}</div>
        <p class="dg-section-error" id="dg-section-error" aria-live="polite"></p>
        <footer class="dg-modal-foot"><button class="dg-modal-button dg-cancel" type="button">取消</button><button class="dg-modal-button primary dg-enter" type="button">确认进入</button></footer>
      </section>
    </div>
    <div class="dg-toast" role="status" aria-live="polite"></div>`;

  function field(label, name, type, placeholder, icon, autocomplete) {
    return `<div class="dg-field" data-field="${name}"><div class="dg-field-head"><label for="dg-${name}">${label}</label></div><div class="dg-input-wrap">${icon}<input class="dg-input" id="dg-${name}" name="${name}" type="${type}" autocomplete="${autocomplete}" placeholder="${placeholder}"></div><p class="dg-field-error" aria-live="polite"></p></div>`;
  }

  function render() {
    if (document.getElementById("dg-login-app")) return;
    document.body.classList.add("dg-login-ready");
    const root = document.createElement("main");
    root.id = "dg-login-app";
    root.innerHTML = appMarkup;
    document.body.prepend(root);
    bind(root);
  }

  function bind(root) {
    let mode = "account";
    let countdown = 0;
    let countdownTimer;
    const form = root.querySelector("#dg-login-form");
    const overlay = root.querySelector("#dg-section-overlay");
    const submit = root.querySelector(".dg-login-submit");
    const storedAccount = localStorage.getItem("donggaRememberedAccount");
    if (storedAccount) {
      root.querySelector("#dg-username").value = storedAccount;
      root.querySelector("#dg-remember").checked = true;
    }

    root.querySelectorAll(".dg-login-tab").forEach(tab => tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      root.querySelectorAll(".dg-login-tab").forEach(item => item.setAttribute("aria-selected", String(item === tab)));
      root.querySelectorAll(".dg-login-panel").forEach(panel => panel.hidden = panel.dataset.panel !== mode);
      clearErrors(root);
      root.querySelector(mode === "account" ? "#dg-username" : "#dg-phone").focus();
    }));

    root.querySelectorAll(".dg-input").forEach(input => {
      input.addEventListener("input", () => {
        const fieldEl = input.closest(".dg-field");
        fieldEl.classList.remove("is-error", "is-valid");
        fieldEl.querySelector(".dg-field-error").textContent = "";
        if (input.name === "phone") input.value = input.value.replace(/\D/g, "").slice(0, 11);
        if (input.name === "code") input.value = input.value.replace(/\D/g, "").slice(0, 6);
      });
      input.addEventListener("blur", () => { if (input.value.trim()) validateOne(root, input.name); });
    });

    root.querySelector("#dg-password-toggle").addEventListener("click", event => {
      const input = root.querySelector("#dg-password");
      input.type = input.type === "password" ? "text" : "password";
      event.currentTarget.setAttribute("aria-label", input.type === "password" ? "显示密码" : "隐藏密码");
    });

    root.querySelector("#dg-forgot").addEventListener("click", () => toast(root, "请联系系统管理员重置密码"));
    root.querySelector("#dg-send-code").addEventListener("click", event => {
      if (!validateOne(root, "phone")) return;
      countdown = 60;
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = `${countdown}秒后重发`;
      toast(root, "验证码已发送，演示验证码为 123456");
      clearInterval(countdownTimer);
      countdownTimer = setInterval(() => {
        countdown -= 1;
        button.textContent = countdown > 0 ? `${countdown}秒后重发` : "重新获取";
        if (countdown <= 0) { clearInterval(countdownTimer); button.disabled = false; }
      }, 1000);
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      const fields = mode === "account" ? ["username", "password"] : ["phone", "code"];
      const valid = fields.map(name => validateOne(root, name)).every(Boolean);
      if (!valid) {
        root.querySelector(`.dg-field.is-error .dg-input`)?.focus();
        return;
      }
      if (mode === "phone" && root.querySelector("#dg-code").value !== "123456") {
        setError(root, "code", "验证码不正确，演示验证码为 123456");
        root.querySelector("#dg-code").focus();
        return;
      }
      if (mode === "account" && root.querySelector("#dg-remember").checked) localStorage.setItem("donggaRememberedAccount", root.querySelector("#dg-username").value.trim());
      else if (mode === "account") localStorage.removeItem("donggaRememberedAccount");
      submit.disabled = true;
      submit.querySelector("span").textContent = "正在验证...";
      setTimeout(() => {
        submit.disabled = false;
        submit.querySelector("span").textContent = "登录";
        overlay.hidden = false;
        root.querySelector('input[name="dg-section"]:checked')?.focus();
      }, 500);
    });

    const closeModal = () => { overlay.hidden = true; root.querySelector("#dg-section-error").textContent = ""; };
    root.querySelector(".dg-modal-close").addEventListener("click", closeModal);
    root.querySelector(".dg-cancel").addEventListener("click", closeModal);
    overlay.addEventListener("click", event => { if (event.target === overlay) closeModal(); });
    root.querySelector(".dg-enter").addEventListener("click", () => {
      const selected = root.querySelector('input[name="dg-section"]:checked');
      if (!selected) { root.querySelector("#dg-section-error").textContent = "请选择需要进入的项目标段"; return; }
      localStorage.setItem("donggaCurrentSection", selected.value);
      localStorage.setItem("donggaLoginMode", mode);
      location.href = "/dashboard/";
    });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !overlay.hidden) closeModal(); });
  }

  function validateOne(root, name) {
    const input = root.querySelector(`[name="${name}"]`);
    const value = input.value.trim();
    const messages = {
      username: !value ? "请输入账号" : value.length < 3 ? "账号至少需要3个字符" : "",
      password: !value ? "请输入密码" : value.length < 6 ? "密码至少需要6个字符" : "",
      phone: !value ? "请输入手机号" : !/^1[3-9]\d{9}$/.test(value) ? "请输入正确的11位手机号" : "",
      code: !value ? "请输入验证码" : !/^\d{6}$/.test(value) ? "验证码应为6位数字" : ""
    };
    if (messages[name]) { setError(root, name, messages[name]); return false; }
    const fieldEl = root.querySelector(`[data-field="${name}"]`);
    fieldEl.classList.remove("is-error");
    fieldEl.classList.add("is-valid");
    fieldEl.querySelector(".dg-field-error").textContent = "";
    return true;
  }

  function setError(root, name, message) {
    const fieldEl = root.querySelector(`[data-field="${name}"]`);
    fieldEl.classList.remove("is-valid");
    fieldEl.classList.add("is-error");
    fieldEl.querySelector(".dg-field-error").textContent = message;
  }

  function clearErrors(root) {
    root.querySelectorAll(".dg-field").forEach(fieldEl => {
      fieldEl.classList.remove("is-error", "is-valid");
      fieldEl.querySelector(".dg-field-error").textContent = "";
    });
  }

  function toast(root, message) {
    const item = root.querySelector(".dg-toast");
    item.textContent = message;
    item.classList.add("show");
    clearTimeout(item.timer);
    item.timer = setTimeout(() => item.classList.remove("show"), 2400);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(render, 150));
  else setTimeout(render, 150);
  setTimeout(render, 900);
})();
