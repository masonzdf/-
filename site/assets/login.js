(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const form = $("#login-form");
  const loginButton = $("#login-button");
  const modal = $("#section-modal");
  const alertBox = $("#form-alert");
  let mode = "account";
  let codeTimer = null;
  let toastTimer = null;

  const rules = {
    username(value) {
      const text = value.trim();
      if (!text) return "请输入账号";
      if (text.length < 3) return "账号至少需要3个字符";
      if (!/^[\w\u4e00-\u9fa5.@-]+$/.test(text)) return "账号包含不支持的字符";
      return "";
    },
    password(value) {
      if (!value) return "请输入密码";
      if (value.length < 6) return "密码至少需要6位";
      return "";
    },
    phone(value) {
      if (!value) return "请输入手机号";
      if (!/^1[3-9]\d{9}$/.test(value)) return "请输入正确的11位手机号";
      return "";
    },
    code(value) {
      if (!value) return "请输入验证码";
      if (!/^\d{6}$/.test(value)) return "请输入6位数字验证码";
      return "";
    }
  };

  function setFieldState(input, validateEmpty = true) {
    const field = input.closest(".field");
    const message = $(".field-message", field);
    const error = !input.value && !validateEmpty ? "" : rules[input.name](input.value);
    field.classList.toggle("is-error", Boolean(error));
    field.classList.toggle("is-valid", Boolean(input.value) && !error);
    message.textContent = error;
    input.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  }

  function validateCurrentPanel() {
    const panel = mode === "account" ? $("#account-panel") : $("#phone-panel");
    return $$("input[name]", panel).map(input => setFieldState(input)).every(Boolean);
  }

  function switchMode(nextMode) {
    mode = nextMode;
    $$(".login-tab").forEach(tab => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("#account-panel").hidden = mode !== "account";
    $("#phone-panel").hidden = mode !== "phone";
    alertBox.hidden = true;
    setTimeout(() => $(mode === "account" ? "#username" : "#phone").focus(), 0);
  }

  function showToast(text) {
    const toast = $("#toast");
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".section-option input", modal).focus(), 30);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    loginButton.disabled = false;
    loginButton.classList.remove("is-loading");
  }

  $$(".login-tab").forEach(tab => tab.addEventListener("click", () => switchMode(tab.dataset.mode)));

  $$("input[name]", form).forEach(input => {
    input.addEventListener("blur", () => setFieldState(input));
    input.addEventListener("input", () => {
      if (input.name === "phone" || input.name === "code") input.value = input.value.replace(/\D/g, "");
      if (input.closest(".field").classList.contains("is-error")) setFieldState(input, false);
      alertBox.hidden = true;
    });
  });

  $(".password-toggle").addEventListener("click", event => {
    const button = event.currentTarget;
    const input = $("#password");
    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.setAttribute("aria-pressed", String(show));
    button.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
    input.focus();
  });

  $("#forgot-password").addEventListener("click", () => showToast("请联系系统管理员重置登录密码"));

  $("#send-code").addEventListener("click", event => {
    const phone = $("#phone");
    if (!setFieldState(phone)) {
      phone.focus();
      return;
    }
    const button = event.currentTarget;
    let seconds = 60;
    button.disabled = true;
    button.textContent = `${seconds}秒后重发`;
    showToast(`验证码已发送至 ${phone.value.slice(0, 3)}****${phone.value.slice(-4)}`);
    clearInterval(codeTimer);
    codeTimer = setInterval(() => {
      seconds -= 1;
      button.textContent = seconds > 0 ? `${seconds}秒后重发` : "重新获取";
      if (seconds <= 0) {
        clearInterval(codeTimer);
        button.disabled = false;
      }
    }, 1000);
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateCurrentPanel()) {
      alertBox.textContent = "请检查并完善标红的登录信息";
      alertBox.hidden = false;
      const firstInvalid = $('.field.is-error input', mode === "account" ? $("#account-panel") : $("#phone-panel"));
      firstInvalid?.focus();
      return;
    }

    alertBox.hidden = true;
    loginButton.disabled = true;
    loginButton.classList.add("is-loading");

    setTimeout(() => {
      if (mode === "account" && $("#remember").checked) {
        localStorage.setItem("donggaLoginAccount", $("#username").value.trim());
      } else if (mode === "account") {
        localStorage.removeItem("donggaLoginAccount");
      }
      openModal();
    }, 650);
  });

  const remembered = localStorage.getItem("donggaLoginAccount");
  if (remembered) {
    $("#username").value = remembered;
    $("#remember").checked = true;
  }

  $$(".section-option input").forEach(input => input.addEventListener("change", () => {
    $(".enter-button").disabled = false;
    $("#section-error").textContent = "";
  }));

  $(".modal-close").addEventListener("click", closeModal);
  $(".cancel-button").addEventListener("click", closeModal);

  $(".enter-button").addEventListener("click", event => {
    const selected = $('input[name="section"]:checked');
    if (!selected) {
      $("#section-error").textContent = "请选择需要进入的项目标段";
      return;
    }
    const account = mode === "account" ? $("#username").value.trim() : $("#phone").value;
    localStorage.setItem("donggaCurrentSection", selected.value);
    localStorage.setItem("donggaLoginMode", mode);
    localStorage.setItem("donggaLoginIdentity", account);
    event.currentTarget.disabled = true;
    event.currentTarget.innerHTML = "正在进入系统...";
    window.location.href = window.location.protocol === "file:"
      ? "./dashboard/index.html"
      : "/dashboard/";
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
})();
