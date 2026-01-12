(function () {
  "use strict";

  const op1El = document.getElementById("op1");
  const op2El = document.getElementById("op2");
  const resEl = document.getElementById("res");
  const contentEl = document.getElementById("content");

  const EPS = 1e-12;

  function parseNumber(value) {
    // allow comma as decimal separator
    const normalized = String(value).trim().replace(",", ".");
    if (normalized === "") return null;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  function setResult(text, isError) {
    resEl.textContent = "Результат: " + text;
    resEl.style.color = isError ? "#ffb4b4" : "";
  }

  function clearHelp() {
    contentEl.innerHTML = "";
  }

  function renderHelp(data) {
    if (!data || data.error) {
      contentEl.innerHTML = `<p>Не вдалося завантажити довідку (HTTP статус: ${data?.status ?? "?"}).</p>`;
      return;
    }

    const imgPath = data.image_name ? `images/${data.image_name}` : "";
    contentEl.innerHTML = `
      <h3>Довідка: ${escapeHtml(data.name || "")}</h3>
      <div class="help">
        <div>
          <p>${escapeHtml(data.description || "")}</p>
          <p class="muted">Джерело: <code>/data/${helpFileNameById(data.id)}</code></p>
        </div>
        ${imgPath ? `<img src="${imgPath}" alt="${escapeHtml(data.name || "formula")}">` : ""}
      </div>
    `;
  }

  function helpFileNameById(id) {
    if (id === 1) return "log.json";
    if (id === 2) return "sin.json";
    if (id === 3) return "tan.json";
    return "—";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getOperands(requireSecond) {
    const a = parseNumber(op1El.value);
    const b = parseNumber(op2El.value);

    if (a === null) {
      setResult("Помилка: введіть коректне число для Операнда 1.", true);
      return null;
    }
    if (requireSecond && b === null) {
      setResult("Помилка: введіть коректне число для Операнда 2.", true);
      return null;
    }
    return { a, b };
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180.0;
  }

  // ---- arithmetic ----
  function add() {
    const o = getOperands(true);
    if (!o) return;
    clearHelp();
    setResult(String(o.a + o.b), false);
  }

  function sub() {
    const o = getOperands(true);
    if (!o) return;
    clearHelp();
    setResult(String(o.a - o.b), false);
  }

  function mul() {
    const o = getOperands(true);
    if (!o) return;
    clearHelp();
    setResult(String(o.a * o.b), false);
  }

  function div() {
    const o = getOperands(true);
    if (!o) return;
    clearHelp();
    if (Math.abs(o.b) < EPS) {
      setResult("Помилка: ділення на нуль.", true);
      return;
    }
    setResult(String(o.a / o.b), false);
  }

  // ---- functions with help ----
  function ln() {
    const o = getOperands(false);
    if (!o) return;

    if (Math.abs(o.a) < EPS) {
      setResult("Помилка: ln(0) не визначений.", true);
    } else if (o.a < 0) {
      setResult("Помилка: ln(x) не визначений для x < 0 (в дійсних числах).", true);
    } else {
      setResult(String(Math.log(o.a)), false);
    }

    $ajaxUtils.sendGetRequest("data/log.json", renderHelp, true);
  }

  function sinDeg() {
    const o = getOperands(false);
    if (!o) return;

    const rad = degToRad(o.a);
    setResult(String(Math.sin(rad)), false);

    $ajaxUtils.sendGetRequest("data/sin.json", renderHelp, true);
  }

  function tanDeg() {
    const o = getOperands(false);
    if (!o) return;

    const rad = degToRad(o.a);
    const cos = Math.cos(rad);

    if (Math.abs(cos) < 1e-10) {
      setResult("Помилка: tan(x) не визначений для цього кута (cos ≈ 0).", true);
    } else {
      setResult(String(Math.tan(rad)), false);
    }

    $ajaxUtils.sendGetRequest("data/tan.json", renderHelp, true);
  }

  // Wire up events
  function init() {
    document.getElementById("add-button").addEventListener("click", add);
    document.getElementById("sub-button").addEventListener("click", sub);
    document.getElementById("mul-button").addEventListener("click", mul);
    document.getElementById("div-button").addEventListener("click", div);

    document.getElementById("log-button").addEventListener("click", ln);
    document.getElementById("sin-button").addEventListener("click", sinDeg);
    document.getElementById("tan-button").addEventListener("click", tanDeg);

    setResult("—", false);
    contentEl.innerHTML = `<p class="muted">Натисни <strong>ln</strong>, <strong>sin</strong> або <strong>tan</strong>, щоб побачити довідку (JSON + статичний сервер).</p>`;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
