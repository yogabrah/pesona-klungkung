/* PESONA — prototipe frontend.
   Tanpa framework, tanpa backend. Data disimpan di localStorage. */
(function () {
  "use strict";

  const D = window.PESONA_DATA;
  const KARYA = D.usaha;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const rp = (n) => "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");
  const rpM = (n) => "Rp" + (Number(n) || 0).toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " M";
  const num = (value) => {
    if (typeof value === "number") return value;
    const cleaned = String(value || "").replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", ".");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };
  const fmtNum = (n) => (Number(n) || 0).toLocaleString("id-ID");
  const escapeHTML = (str) => String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const debounce = (fn, wait = 120) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };
  const pad = (n) => String(n).padStart(2, "0");
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const fmtLongDate = (d) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const fmtDate = (d) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
  const fmtDateTime = (d) => `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}.${pad(d.getMinutes())}`;

  /* ---------- storage ---------- */
  const LS = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("pesona." + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("pesona." + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    remove(key) {
      try { localStorage.removeItem("pesona." + key); } catch (e) { /* ignore */ }
    }
  };

  const state = {
    theme: document.documentElement.getAttribute("data-theme") || "light",
    completed: new Set(LS.get("completed", [])),
    customArticles: LS.get("customArticles", []),
    articles: [],
    registrations: LS.get("registrations", []),
    reports: LS.get("reports", []),
    tickets: LS.get("tickets", []),
    queueOverrides: LS.get("queueOverrides", {}),
    providers: LS.get("providers", []),
    providerOverrides: LS.get("providerOverrides", {}),
    bookings: LS.get("bookings", []),
    trainingRegs: LS.get("trainingRegs", []),
    appointments: LS.get("appointments", []),
    quizBest: Number(LS.get("quizBest", 0)) || 0,
    bookingProvider: null,
    providerFilter: "all",
    providerArea: "all",
    providerSearch: "",
    account: LS.get("account", false),
    notifRead: LS.get("notifRead", []),
    docChecks: new Set(LS.get("docChecks", [])),
    currentView: "beranda",
    pendingService: null,
    eduFilter: "all",
    eduSearch: "",
    calOffset: 0,
    calSelected: null,
    flowStep: 0,
    calcType: "pbjt",
    calcValues: {},
    wizard: null,
    quiz: { index: 0, selected: null, answered: false, score: 0, finished: false },
    searchResults: [],
    searchIndex: 0,
    adminView: "ringkasan",
    adminChartMode: "monthly",
    adminTaxSearch: "",
    adminTaxStatus: "all",
    adminTaxType: "all",
    adminQueueTab: "pendaftaran",
    revealObserver: null
  };
  state.articles = [...state.customArticles, ...D.articles];

  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const calendarEvents = [
    { date: addDays(baseDate, 3), title: "Batas lapor PBJT", desc: "Contoh tenggat pelaporan masa pajak. Cocokkan dengan kode billing resmi.", tone: "accent" },
    { date: addDays(baseDate, 8), title: "Klinik NPWPD", desc: "Sesi pendampingan dokumen di meja layanan PESONA, MPP Klungkung.", tone: "forest" },
    { date: addDays(baseDate, 12), title: "Batas setor masa pajak", desc: "Tanggal ilustrasi untuk pengingat pembayaran. Bukan jadwal resmi.", tone: "accent" },
    { date: addDays(baseDate, 18), title: "Sosialisasi PBB-P2", desc: "Diskusi terbuka tentang NJOP, NJOPTKP, dan pembaruan data objek.", tone: "forest" },
    { date: addDays(baseDate, 5), title: "Homestay Naik Kelas", desc: "Pelatihan contoh bersama PLUT dan PHRI di Nusa Penida.", tone: "forest" },
    { date: addDays(baseDate, 15), title: "Klinik izin usaha", desc: "Pendampingan dokumen NIB, TDUP/SLS, NPWPD, dan sertifikasi.", tone: "accent" }
  ];

  /* ---------- article helpers ---------- */
  const articleById = (id) => state.articles.find((a) => a.id === id);
  const taxById = (id) => D.taxes.find((t) => t.id === id);
  const articlesByModule = (module) => state.articles.filter((a) => a.module === module);
  const isDone = (id) => state.completed.has(id);
  const completionCount = () => state.articles.filter((a) => state.completed.has(a.id)).length;

  function saveCompleted() { LS.set("completed", Array.from(state.completed)); }
  function saveCustomArticles() { LS.set("customArticles", state.customArticles); }
  function saveDynamic() {
    LS.set("registrations", state.registrations);
    LS.set("reports", state.reports);
    LS.set("tickets", state.tickets);
    LS.set("queueOverrides", state.queueOverrides);
    LS.set("providers", state.providers);
    LS.set("providerOverrides", state.providerOverrides);
    LS.set("bookings", state.bookings);
    LS.set("trainingRegs", state.trainingRegs);
    LS.set("appointments", state.appointments);
  }

  function syncArticleLists() {
    state.articles = [...state.customArticles, ...D.articles];
  }

  /* ---------- theme ---------- */
  function applyTheme(theme, announce = false) {
    state.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", state.theme);
    try { localStorage.setItem("pesona.theme", state.theme); } catch (e) { /* ignore */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#0b211e" : "#0e4f47");
    $$(".theme-toggle").forEach((btn) => btn.setAttribute("aria-label", state.theme === "dark" ? "Gunakan tema terang" : "Gunakan tema gelap"));
    if (announce) toast("info", "Tema diperbarui", state.theme === "dark" ? "Mode gelap aktif." : "Mode terang aktif.");
  }
  function toggleTheme() { applyTheme(state.theme === "dark" ? "light" : "dark"); }

  /* ---------- toast ---------- */
  function toast(type, title, message) {
    const region = $("#toastRegion");
    if (!region) return;
    while (region.children.length >= 3) region.firstElementChild.remove();
    const el = document.createElement("div");
    el.className = "toast " + (type || "info");
    const iconName = type === "success" ? "circle-check" : type === "error" ? "circle-alert" : "info";
    el.innerHTML = `<span class="toast-icon">${icon(iconName)}</span><div class="toast-main"><strong>${escapeHTML(title)}</strong>${message ? `<span>${escapeHTML(message)}</span>` : ""}</div><button class="toast-close" type="button" aria-label="Tutup notifikasi">${icon("x")}</button>`;
    region.appendChild(el);
    const remove = () => {
      if (!el.isConnected || el.classList.contains("is-leaving")) return;
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 260);
    };
    el.querySelector(".toast-close").addEventListener("click", remove);
    setTimeout(remove, 4600);
  }

  /* ---------- dialog ---------- */
  const dialog = $("#appDialog");
  const dialogContent = $("#dialogContent");
  let lastFocus = null;

  function openDialog(html, opts = {}) {
    if (!dialog || !dialogContent) return;
    const wasOpen = dialog.open;
    if (!wasOpen) lastFocus = document.activeElement;
    dialog.classList.toggle("dialog--wide", !!opts.wide);
    dialog.classList.toggle("dialog--drawer", !!opts.drawer);
    dialogContent.innerHTML = html;
    dialogContent.scrollTop = 0;
    if (!wasOpen) {
      dialog.showModal();
    }
    document.body.classList.add("modal-open");
    setTimeout(() => {
      const target = dialogContent.querySelector("[autofocus]") || dialogContent.querySelector(".wizard-body input, .wizard-body select, .wizard-body textarea");
      if (target) target.focus({ preventScroll: true });
      else {
        dialogContent.setAttribute("tabindex", "-1");
        dialogContent.focus({ preventScroll: true });
      }
    }, 60);
  }

  function closeDialog() {
    if (!dialog || !dialog.open) return;
    dialog.close();
  }

  function onDialogClosed() {
    document.body.classList.remove("modal-open");
    dialog.classList.remove("dialog--wide", "dialog--drawer");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  /* ---------- navigation ---------- */
  function currentRoute() {
    const raw = (location.hash || "").replace(/^#\/?/, "");
    if (!raw) return { view: "beranda", sub: null };
    const [path] = raw.split("?");
    const seg = path.split("/").filter(Boolean);
    return { view: seg[0] || "beranda", sub: seg[1] || null };
  }

  function go(hash) {
    if (location.hash === hash) { onRoute(); return; }
    location.hash = hash;
  }

  const TITLES = {
    beranda: "PESONA — Pusat Edukasi & Optimalisasi Usaha",
    edukasi: "Pusat Edukasi — PESONA",
    pajak: "Jenis Pajak Daerah — PESONA",
    kalkulator: "Kalkulator Pajak — PESONA",
    layanan: "Layanan Pajak — PESONA",
    usaha: "Citta Karya — PESONA",
    akun: "Akun Wajib Pajak — PESONA"
  };
  const ADMIN_TITLES = {
    ringkasan: "Ringkasan",
    pendapatan: "Pendapatan",
    "wajib-pajak": "Wajib Pajak",
    layanan: "Layanan",
    usaha: "Citta Karya",
    edukasi: "Konten Edukasi"
  };

  function onRoute() {
    const { view, sub } = currentRoute();
    closeDialog();
    closeMobileNav();
    closeNotif();
    document.body.classList.remove("admin-menu-open");

    if (view === "petugas") {
      document.body.classList.add("admin-mode");
      $("#publicShell").hidden = true;
      $("#adminShell").hidden = false;
      const adminView = ADMIN_TITLES[sub] ? sub : "ringkasan";
      state.adminView = adminView;
      state.currentView = "petugas";
      $$(".main-nav a, .mobile-nav a").forEach((a) => a.classList.remove("active"));
      renderAdmin();
      document.title = `${ADMIN_TITLES[adminView]} — Portal Petugas PESONA`;
    } else {
      document.body.classList.remove("admin-mode");
      $("#publicShell").hidden = false;
      $("#adminShell").hidden = true;
      const safeView = TITLES[view] ? view : "beranda";
      if (safeView !== view) {
        history.replaceState(null, "", "#/beranda");
      }
      state.currentView = safeView;
      $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + safeView));
      $$(".main-nav a, .mobile-nav a").forEach((a) => {
        const active = a.dataset.nav === safeView;
        a.classList.toggle("active", active);
        if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      renderPublicView(safeView);
      document.title = TITLES[safeView] || TITLES.beranda;
    }
    window.scrollTo(0, 0);
    const pending = state.pendingService;
    state.pendingService = null;
    if (pending && !view.startsWith("petugas")) {
      setTimeout(() => openService(pending), 80);
    }
    initReveals();
  }

  function renderPublicView(view) {
    if (view === "beranda") renderHome();
    if (view === "edukasi") renderEducation();
    if (view === "pajak") renderTaxPage();
    if (view === "kalkulator") renderCalculator();
    if (view === "layanan") renderServicesPage();
    if (view === "usaha") renderUsaha();
    if (view === "akun") renderAccount();
  }

  /* ---------- mobile nav / notif ---------- */
  function openMobileNav() {
    const nav = $("#mobileNav");
    const btn = $("#mobileMenuBtn");
    nav.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    btn.innerHTML = icon("x");
  }
  function closeMobileNav() {
    const nav = $("#mobileNav");
    const btn = $("#mobileMenuBtn");
    if (!nav || nav.hidden) return;
    nav.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = icon("menu");
  }
  function toggleMobileNav() {
    if ($("#mobileNav").hidden) openMobileNav(); else closeMobileNav();
  }

  function renderNotifications() {
    const list = $("#notifList");
    if (!list) return;
    list.innerHTML = D.notifications.map((n) => {
      const read = state.notifRead.includes(n.id) || !n.unread;
      return `<button class="notif-item ${read ? "is-read" : ""}" type="button" data-notif-id="${n.id}">
        <span class="notif-icon">${icon(n.icon)}</span>
        <span class="notif-main"><strong>${escapeHTML(n.title)}</strong><span>${escapeHTML(n.desc)}</span><time>${escapeHTML(n.time)}</time></span>
      </button>`;
    }).join("");
    const unread = D.notifications.some((n) => n.unread && !state.notifRead.includes(n.id));
    $("#notifDot").classList.toggle("is-read", !unread);
  }
  function openNotif() {
    $("#notifPop").hidden = false;
    $("#notifTrigger").setAttribute("aria-expanded", "true");
  }
  function closeNotif() {
    const pop = $("#notifPop");
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    $("#notifTrigger").setAttribute("aria-expanded", "false");
  }
  function markAllNotifRead() {
    state.notifRead = D.notifications.map((n) => n.id);
    LS.set("notifRead", state.notifRead);
    renderNotifications();
    toast("success", "Notifikasi ditandai", "Semua pemberitahuan contoh sudah dibaca.");
  }

  function updateAuthUI() {
    const btn = $("#loginBtn");
    if (!btn) return;
    btn.textContent = state.account ? "Akun saya" : "Masuk";
    btn.setAttribute("aria-label", state.account ? "Buka akun demo" : "Masuk ke PESONA");
  }

  /* ---------- reveal ---------- */
  function initReveals(scope = document) {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!state.revealObserver) {
      state.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            entry.target.classList.add("reveal-in");
            state.revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.06, rootMargin: "0px 0px -5% 0px" });
    }
    const selectors = ".section-head, .tax-card, .impact-media, .impact-copy, .edu-feature-card, .edu-list-item, .flow-panel, .announcement, .calendar-card, .cta-panel, .path-card, .feature-article, .article-card, .quiz-card, .tax-row, .compare-card, .service-card, .status-panel, .doc-card, .help-band, .account-hero, .account-card, .citta-card, .provider-card, .training-card, .usaha-stat, .trust-strip > div, .partner-card, .koperasi-card";
    $$(selectors, scope).forEach((el, index) => {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = "1";
      el.classList.add("reveal-pending");
      state.revealObserver.observe(el);
    });
  }

  /* ---------- header scroll sentinel ---------- */
  function setupHeaderSentinel() {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    const header = $("#siteHeader");
    if (!header) return;
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(([entry]) => {
        header.classList.toggle("is-scrolled", !entry.isIntersecting);
      }, { threshold: 0 });
      io.observe(sentinel);
    }
  }

  /* ---------- article modal ---------- */
  function renderArticleBody(body) {
    return body.map((b) => {
      if (b.t === "h") return `<h3>${escapeHTML(b.x)}</h3>`;
      if (b.t === "p") return `<p>${escapeHTML(b.x)}</p>`;
      if (b.t === "list") return `<ul>${b.x.map((x) => `<li>${escapeHTML(x)}</li>`).join("")}</ul>`;
      if (b.t === "note") return `<div class="note">${escapeHTML(b.x)}</div>`;
      if (b.t === "table") return `<table><tbody>${b.x.map(([k, v]) => `<tr><td>${escapeHTML(k)}</td><td>${escapeHTML(v)}</td></tr>`).join("")}</tbody></table>`;
      return "";
    }).join("");
  }

  function openArticle(id) {
    const article = articleById(id);
    if (!article) return;
    const done = isDone(article.id);
    const related = state.articles.filter((a) => a.id !== article.id && (a.category === article.category || a.module === article.module)).slice(0, 3);
    const cover = article.image ? `<div class="article-modal-cover"><img src="${article.image}" alt=""><span class="badge badge-sun cover-cat">${escapeHTML(article.category)} · ${article.minutes} menit</span></div>` : "";
    const html = `${cover}
      <div class="article-modal-head">
        <div class="meta"><span>${icon("book-open")} ${escapeHTML(article.category)}</span><span>${icon("clock")} ${article.minutes} menit baca</span><span>${icon("landmark")} Edukasi pajak daerah</span></div>
        <h2 id="dialogTitle">${escapeHTML(article.title)}</h2>
        <p class="lead">${escapeHTML(article.excerpt)}</p>
      </div>
      <div class="article-body">${renderArticleBody(article.body)}</div>
      <div class="article-takeaways"><h3>Yang bisa dibawa pulang</h3><ul>${article.takeaways.map((t) => `<li>${icon("check")}<span>${escapeHTML(t)}</span></li>`).join("")}</ul></div>
      <div class="article-modal-foot">
        <p class="micro">Materi edukasi umum. Ketentuan resmi mengikuti Perda dan peraturan yang berlaku. Data pada prototipe ini adalah simulasi.</p>
        <div class="actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${escapeHTML(article.title)} — PESONA">${icon("copy")} Salin judul</button>
          <button class="btn ${done ? "btn-secondary" : "btn-primary"}" type="button" data-mark-complete="${article.id}">${icon(done ? "check" : "circle-check")} ${done ? "Selesai dibaca" : "Tandai selesai"}</button>
        </div>
      </div>
      ${related.length ? `<div class="article-related"><h3>Materi terkait</h3><div class="article-related-list">${related.map((a) => `<button class="article-related-item" type="button" data-article-id="${a.id}"><span>${escapeHTML(a.title)}</span>${icon("arrow-right")}</button>`).join("")}</div></div>` : ""}`;
    openDialog(html, { wide: true });
  }

  function toggleArticleDone(id) {
    if (state.completed.has(id)) state.completed.delete(id);
    else state.completed.add(id);
    saveCompleted();
    const article = articleById(id);
    toast("success", state.completed.has(id) ? "Materi selesai" : "Tanda dibatalkan", article ? article.title : "");
    openArticle(id);
    if (state.currentView === "edukasi") renderEducation();
    if (state.currentView === "akun") renderAccount();
    if (state.currentView === "beranda") renderHome();
  }

  /* ---------- tax modal ---------- */
  function openTax(id) {
    const t = taxById(id);
    if (!t) return;
    const html = `<div class="tax-modal-hero">
        <div class="tax-icon">${icon(t.icon)}</div>
        <h2 id="dialogTitle">${escapeHTML(t.name)}</h2>
        <p>${escapeHTML(t.long)}</p>
        <div class="tax-modal-rate"><strong>${escapeHTML(t.rate)}</strong><span>${escapeHTML(t.rateNote)}</span></div>
      </div>
      <div class="tax-modal-body">
        <div class="tax-facts">
          <div class="tax-fact"><span>Masa pajak</span><strong>${escapeHTML(t.period)}</strong></div>
          <div class="tax-fact"><span>Jatuh tempo</span><strong>${escapeHTML(t.due)}</strong></div>
          <div class="tax-fact"><span>Subjek</span><strong>${escapeHTML(t.subject)}</strong></div>
          <div class="tax-fact"><span>Objek</span><strong>${escapeHTML(t.object)}</strong></div>
        </div>
        <h3>Hal yang perlu dipahami</h3>
        <ul class="tax-points">${t.points.map((p) => `<li>${icon("check")}<span>${escapeHTML(p)}</span></li>`).join("")}</ul>
        <div class="tax-example"><span>Ilustrasi perhitungan</span><strong>${escapeHTML(t.example.result)}</strong><p>${escapeHTML(t.example.label)}. ${escapeHTML(t.example.note)}</p></div>
        <h3>Dokumen &amp; kanal</h3>
        <div class="tax-chips">${t.docs.map((d) => `<span>${escapeHTML(d)}</span>`).join("")}</div>
        <div class="tax-chips">${t.channels.map((c) => `<span>${escapeHTML(c)}</span>`).join("")}</div>
        <p class="note-line">${escapeHTML(t.legal)}</p>
      </div>
      <div class="tax-modal-foot">
        <p class="micro">Materi edukasi. Bukan ketetapan pajak.</p>
        <div class="actions">
          <button class="btn btn-secondary" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya petugas</button>
          <button class="btn btn-primary" type="button" data-preset-calc="${t.id}">${icon("calculator")} Hitung simulasi</button>
        </div>
      </div>`;
    openDialog(html, { wide: true });
  }

  /* ---------- announcement ---------- */
  function openAnnouncement(index) {
    const item = D.announcementList[index];
    if (!item) return;
    openDialog(`<div class="dialog-pad dialog-pad-top">
      <span class="badge badge-sun">${escapeHTML(item.tag)}</span>
      <h2 id="dialogTitle" style="margin-top:12px;font-size:1.7rem">${escapeHTML(item.title)}</h2>
      <p style="margin-top:7px;font-size:11px;color:var(--muted)">${icon("calendar-days")} ${escapeHTML(item.date)}</p>
      <p style="margin-top:16px;font-size:.9rem;line-height:1.7;color:var(--ink-2)">${escapeHTML(item.desc)}</p>
      <div class="article-body" style="padding:0;margin-top:14px">
        <div class="note">Ini adalah pengumuman contoh pada prototipe. Jadwal dan kegiatan nyata mengikuti kanal resmi pemerintah daerah.</div>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:20px">
        <button class="btn btn-primary" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya layanan</button>
        <a class="btn btn-secondary" href="#/edukasi">Buka materi edukasi</a>
      </div>
    </div>`);
  }

  /* ---------- login ---------- */
  function openLogin() {
    if (state.account) { go("#/akun"); return; }
    openDialog(`<div class="login-head">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="currentColor"></rect><path d="M14 29V11h6.2a5.4 5.4 0 1 1 0 10.8H14" fill="none" stroke="#F7F3E8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="28" cy="12.6" r="2.2" fill="#E39B3B"></circle><path d="M14 33h11" stroke="#E39B3B" stroke-width="2" stroke-linecap="round"></path></svg></span>
        <h2 id="dialogTitle">Masuk ke PESONA</h2>
        <p>Pilih peran untuk mencoba alur prototipe. Tidak perlu kata sandi.</p>
      </div>
      <div class="login-body">
        <div class="login-roles">
          <button class="login-role" type="button" data-login-role="warga">
            <span class="login-role-icon">${icon("user-round")}</span>
            <span><strong>Sebagai wajib pajak</strong><span>Lihat kewajiban contoh, riwayat pembayaran, dan progres belajar.</span></span>
            ${icon("arrow-right")}
          </button>
          <button class="login-role" type="button" data-login-role="usaha">
            <span class="login-role-icon">${icon("store")}</span>
            <span><strong>Sebagai pelaku usaha</strong><span>Lihat ruang usaha, registry penyedia, dan progres pelatihan.</span></span>
            ${icon("arrow-right")}
          </button>
          <button class="login-role" type="button" data-login-role="petugas">
            <span class="login-role-icon">${icon("layout-dashboard")}</span>
            <span><strong>Sebagai petugas PESONA</strong><span>Buka dashboard pendapatan, wajib pajak, Citta Karya, dan antrean layanan.</span></span>
            ${icon("arrow-right")}
          </button>
        </div>
        <div class="login-note">${icon("info")} <span>Mode demo. Akun, nomor NPWPD, dan seluruh aktivitas pada prototipe ini adalah fiktif.</span></div>
      </div>`);
  }

  function loginAs(role) {
    closeDialog();
    if (role === "petugas") {
      go("#/petugas/ringkasan");
      toast("success", "Portal petugas dibuka", "Anda berada di mode demo petugas PESONA.");
      return;
    }
    state.account = true;
    LS.set("account", true);
    updateAuthUI();
    if (role === "usaha") {
      toast("success", "Masuk sebagai pelaku usaha", "Ruang usaha demo Kafe Sunrise Penida siap dicoba.");
      go("#/usaha");
      return;
    }
    toast("success", "Masuk sebagai wajib pajak", "Akun demo Ayu Pramesti siap dicoba.");
    go("#/akun");
  }

  function logoutAccount(silent = false) {
    state.account = false;
    LS.set("account", false);
    updateAuthUI();
    if (!silent) toast("info", "Keluar dari akun demo", "Anda masih bisa menjelajahi layanan tanpa masuk.");
    if (state.currentView === "akun") renderAccount();
  }

  /* ============================================================
     BERANDA
     ============================================================ */
  function taxCardHTML(t) {
    if (t.id === "pbjt") {
      return `<a class="tax-card tax-card--feature tone-forest" href="#/pajak" data-tax-id="${t.id}">
        <span class="tax-icon">${icon(t.icon)}</span>
        <span class="tax-rate">${escapeHTML(t.rate)}</span>
        <h3>${escapeHTML(t.name)}</h3>
        <span class="tax-long">${escapeHTML(t.long)}</span>
        <span class="tax-chips">${t.subtypes.map((s) => `<span>${escapeHTML(s)}</span>`).join("")}</span>
        <span class="tax-example">Contoh: omzet Rp25 juta<br><strong>Perkiraan pajak Rp2,5 juta</strong></span>
        <span class="tax-arrow">Pelajari ${escapeHTML(t.name)} ${icon("arrow-up-right")}</span>
      </a>`;
    }
    return `<a class="tax-card tone-${t.tone}" href="#/pajak" data-tax-id="${t.id}">
      <span class="tax-icon">${icon(t.icon)}</span>
      <span class="tax-rate">${escapeHTML(t.rate)}</span>
      <h3>${escapeHTML(t.name)}</h3>
      <span class="tax-long">${escapeHTML(t.long)}</span>
      <span class="tax-arrow">Pelajari ${icon("arrow-up-right")}</span>
    </a>`;
  }

  function articleMetaHTML(article) {
    return `<span class="article-cat">${icon("book-open")} ${escapeHTML(article.category)}</span><span class="minutes">${article.minutes} menit</span>`;
  }

  function renderHome() {
    const taxGrid = $("#homeTaxGrid");
    if (taxGrid) taxGrid.innerHTML = D.taxes.map(taxCardHTML).join("");

    const featured = articleById("pbjt-dasar") || state.articles[0];
    const listIds = ["daftar-npwpd", "pbb-njoptkp", "bayar-qris"];
    const edu = $("#eduPreview");
    if (edu && featured) {
      const done = isDone(featured.id);
      edu.innerHTML = `<a class="edu-feature-card" href="#/edukasi" data-article-id="${featured.id}">
          <img src="${featured.image || "assets/img/kuliner.jpg"}" alt="">
          <span class="badge">${done ? "Selesai dibaca" : escapeHTML(featured.category)}</span>
          <h3>${escapeHTML(featured.title)}</h3>
          <p>${escapeHTML(featured.excerpt)}</p>
          <span class="edu-feature-meta"><span>${icon("clock")} ${featured.minutes} menit</span><span>${icon("book-open")} ${escapeHTML(featured.level)}</span></span>
        </a>
        <div class="edu-list">${listIds.map((id) => {
          const a = articleById(id);
          if (!a) return "";
          return `<a class="edu-list-item" href="#/edukasi" data-article-id="${a.id}">
            <span><span class="meta">${escapeHTML(a.category)}<i class="dotsep"></i>${a.minutes} menit ${isDone(a.id) ? `<i class="dotsep"></i><span style="color:var(--ok)">Selesai</span>` : ""}</span><h4>${escapeHTML(a.title)}</h4><p>${escapeHTML(a.excerpt)}</p></span>
            <span class="arrow">${icon("arrow-up-right")}</span>
          </a>`;
        }).join("")}</div>`;
    }

    const ann = $("#announcementList");
    if (ann) {
      ann.innerHTML = D.announcementList.map((a, i) => `<a class="announcement" href="#/beranda" data-announcement="${i}">
        <span class="announcement-date">${escapeHTML(a.date)}</span>
        <span><span class="badge badge-sun">${escapeHTML(a.tag)}</span><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.desc)}</p></span>
        ${icon("arrow-up-right")}
      </a>`).join("");
    }

    renderFaq(D.faqs.slice(0, 6), "#homeFaq", "home");
    renderHomeProviders();
    renderFlow(state.flowStep);
    renderCalendar();
    syncHeroCalc();
    initReveals($("#view-beranda"));
  }

  function syncHeroCalc() {
    const input = $("#heroOmzet");
    const out = $("#heroTax");
    if (!input || !out) return;
    const value = num(input.value);
    out.textContent = rp(value * 0.1);
  }

  function renderFlow(index) {
    const steps = [
      {
        label: "Daftar",
        title: "Daftarkan usaha, dapatkan NPWPD.",
        desc: "Siapkan identitas dan data usaha. Setelah terverifikasi, NPWPD menjadi nomor Anda untuk seluruh administrasi pajak daerah.",
        bullets: ["KTP dan NIB/izin usaha", "Data lokasi serta jenis kegiatan", "Contoh verifikasi 3 hari kerja"],
        time: "± 7 menit mengisi",
        cta: "Mulai pendaftaran",
        action: "daftar"
      },
      {
        label: "Hitung",
        title: "Pahami angka sebelum melapor.",
        desc: "Gunakan kalkulator untuk melihat pengaruh omzet, NJOP, atau nilai dasar terhadap perkiraan pajak. Hasilnya untuk belajar, bukan ketetapan.",
        bullets: ["Pilih jenis pajak dan masa", "Masukkan nilai dasar", "Simpan ringkasan untuk konsultasi"],
        time: "± 3 menit",
        cta: "Buka kalkulator",
        goto: "#/kalkulator"
      },
      {
        label: "Lapor",
        title: "Kirim ringkasan masa pajak.",
        desc: "Laporan berisi nilai dasar, perhitungan, dan identitas wajib pajak. Pastikan data cocok dengan catatan usaha Anda.",
        bullets: ["Nomor NPWPD dan masa pajak", "Nilai dasar serta perhitungan", "Simpan bukti pelaporan"],
        time: "± 10 menit",
        cta: "Simulasi pelaporan",
        action: "lapor"
      },
      {
        label: "Bayar",
        title: "Gunakan kanal resmi dan simpan bukti.",
        desc: "Setelah laporan, gunakan kode billing pada kanal resmi. Prototipe ini hanya memperlihatkan alurnya, tidak memproses pembayaran.",
        bullets: ["Periksa nama dan nominal", "Pindai QRIS dari kanal resmi", "Cek status setelah membayar"],
        time: "± 2 menit",
        cta: "Lihat alur bayar",
        action: "lapor"
      }
    ];
    const s = steps[index] || steps[0];
    $("#flowPanel").innerHTML = `<h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.desc)}</p>
      <ul>${s.bullets.map((b) => `<li>${icon("check")}<span>${escapeHTML(b)}</span></li>`).join("")}</ul>
      <div class="flow-detail-foot"><span>${escapeHTML(s.time)}</span>${s.goto ? `<a class="btn" href="${s.goto}" data-goto="${s.goto}">${escapeHTML(s.cta)} ${icon("arrow-right")}</a>` : `<button class="btn" type="button" data-open-service="${s.action}">${escapeHTML(s.cta)} ${icon("arrow-right")}</button>`}</div>`;
    $$(".flow-tab").forEach((tab, i) => {
      const active = i === index;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    $("#flowPanel").setAttribute("aria-labelledby", "flowTab" + (index + 1));
  }

  function renderFaq(items, target, group) {
    const container = $(target);
    if (!container) return;
    container.innerHTML = items.map((f, i) => `<div class="acc-item" data-acc-item>
      <button class="acc-trigger" type="button" aria-expanded="false" aria-controls="${group}-faq-${i}" data-acc-trigger>${escapeHTML(f.q)}<span class="acc-icon">${icon("plus")}</span></button>
      <div class="acc-panel" id="${group}-faq-${i}"><div><p>${escapeHTML(f.a)}</p></div></div>
    </div>`).join("");
  }

  function isoLocal(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }

  function eventsForMonth(year, month) {
    return calendarEvents.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month);
  }

  function renderCalendar() {
    const label = $("#calendarMonth");
    const daysEl = $("#calendarDays");
    const eventEl = $("#calendarEvent");
    if (!label || !daysEl || !eventEl) return;
    const now = new Date();
    const view = new Date(now.getFullYear(), now.getMonth() + state.calOffset, 1);
    label.textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const monthEvents = eventsForMonth(view.getFullYear(), view.getMonth());
    if (!state.calSelected || !state.calSelected.startsWith(`${view.getFullYear()}-${pad(view.getMonth() + 1)}`)) {
      state.calSelected = monthEvents.length ? isoLocal(monthEvents[0].date) : null;
    }
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const prevMonthDays = new Date(view.getFullYear(), view.getMonth(), 0).getDate();
    let cells = [];
    for (let i = offset - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, outside: true, date: new Date(view.getFullYear(), view.getMonth() - 1, prevMonthDays - i) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, outside: false, date: new Date(view.getFullYear(), view.getMonth(), d) });
    }
    let next = 1;
    while (cells.length % 7 !== 0 || cells.length < 35) {
      cells.push({ day: next, outside: true, date: new Date(view.getFullYear(), view.getMonth() + 1, next) });
      next++;
    }
    daysEl.innerHTML = cells.map((c) => {
      if (c.outside) return `<span class="cal-day is-outside" aria-hidden="true"></span>`;
      const iso = isoLocal(c.date);
      const event = calendarEvents.find((e) => sameDay(e.date, c.date));
      const classes = ["cal-day"];
      if (sameDay(c.date, now)) classes.push("is-today");
      if (event) classes.push("has-event");
      if (state.calSelected === iso) classes.push("is-selected");
      return `<button class="${classes.join(" ")}" type="button" data-cal-day="${iso}" aria-label="${fmtLongDate(c.date)}${event ? " — " + escapeHTML(event.title) : ""}" aria-pressed="${state.calSelected === iso}">${c.day}</button>`;
    }).join("");
    const selectedDate = state.calSelected ? new Date(state.calSelected + "T00:00:00") : null;
    const selectedEvent = selectedDate ? calendarEvents.find((e) => sameDay(e.date, selectedDate)) : null;
    if (selectedEvent) {
      eventEl.innerHTML = `<span class="mini-label">${fmtLongDate(selectedEvent.date)}</span><strong>${escapeHTML(selectedEvent.title)}</strong><p>${escapeHTML(selectedEvent.desc)}</p>`;
    } else if (selectedDate) {
      eventEl.innerHTML = `<span class="mini-label">${fmtLongDate(selectedDate)}</span><strong>Tidak ada agenda contoh.</strong><p>Pilih tanggal bertanda titik oranye untuk melihat agenda ilustrasi.</p>`;
    } else {
      eventEl.innerHTML = `<span class="mini-label">Kalender ilustrasi</span><strong>Pilih tanggal bertanda.</strong><p>Titik oranye menandai agenda contoh pada bulan ini.</p>`;
    }
  }

  /* ============================================================
     EDUKASI
     ============================================================ */
  const catIcon = (category) => ({
    "PBJT": "utensils",
    "PBB-P2": "house",
    "BPHTB": "file-signature",
    "Reklame": "signpost",
    "PAT": "droplets",
    "Administrasi": "clipboard-check",
    "Pembayaran": "credit-card",
    "Kepatuhan": "shield-check",
    "Panduan": "book-open"
  }[category] || "book-open");

  function renderEducation() {
    renderEduProgress();
    renderPaths();
    renderEduFilters();
    renderArticleResults();
    renderQuiz();
    renderCertificateBanner();
    renderFaq(D.faqs, "#eduFaq", "edu");
    initReveals($("#view-edukasi"));
  }

  function renderEduProgress() {
    const total = state.articles.length;
    const done = completionCount();
    const pct = total ? Math.round((done / total) * 100) : 0;
    const ring = $("#eduProgressRing");
    if (ring) ring.style.setProperty("--pct", pct);
    const pctEl = $("#eduProgressPct");
    if (pctEl) pctEl.textContent = pct + "%";
    const label = $("#eduProgressLabel");
    if (label) label.textContent = done === 0 ? "Belum dimulai" : done === total ? "Semua materi selesai" : "Sedang belajar";
    const meta = $("#eduProgressMeta");
    if (meta) meta.textContent = `${done} dari ${total} materi selesai`;
  }

  function renderPaths() {
    const grid = $("#pathGrid");
    if (!grid) return;
    grid.innerHTML = D.learningPaths.map((p) => {
      const list = articlesByModule(p.id);
      const done = list.filter((a) => isDone(a.id)).length;
      const pct = list.length ? Math.round((done / list.length) * 100) : 0;
      return `<a class="path-card" href="#/edukasi" data-path="${p.id}">
        <span class="path-icon tone-${p.tone === "forest" ? "forest" : p.tone}">${icon(p.icon)}</span>
        <h3>${escapeHTML(p.title)}</h3>
        <p>${escapeHTML(p.desc)}</p>
        <span class="path-progress"><span class="path-bar"><span style="width:${pct}%"></span></span><span class="path-meta"><span class="${done === list.length && list.length ? "done" : ""}">${done}/${list.length} selesai</span><span>${pct}%</span></span></span>
      </a>`;
    }).join("");
  }

  function renderEduFilters() {
    const wrap = $("#eduFilters");
    if (!wrap) return;
    const categories = Array.from(new Set(state.articles.map((a) => a.category)));
    let extra = "";
    if (state.eduFilter.startsWith("module:")) {
      const path = D.learningPaths.find((p) => p.id === state.eduFilter.split(":")[1]);
      if (path) extra = `<button class="chip active" type="button" data-edu-filter="all">${escapeHTML(path.title)} ${icon("x")}</button>`;
    }
    if (state.eduFilter === "done") extra = `<button class="chip active" type="button" data-edu-filter="done">Selesai dibaca</button>`;
    wrap.innerHTML = `<button class="chip ${state.eduFilter === "all" ? "active" : ""}" type="button" data-edu-filter="all">Semua</button>${extra}${categories.map((c) => `<button class="chip ${state.eduFilter === c ? "active" : ""}" type="button" data-edu-filter="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("")}`;
  }

  function eduMatches(article) {
    const q = state.eduSearch.trim().toLowerCase();
    if (q) {
      const hay = [article.title, article.category, article.excerpt, article.level, ...article.body.map((b) => Array.isArray(b.x) ? b.x.join(" ") : b.x)].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (state.eduFilter === "all") return true;
    if (state.eduFilter === "done") return isDone(article.id);
    if (state.eduFilter.startsWith("module:")) return article.module === state.eduFilter.split(":")[1];
    return article.category === state.eduFilter;
  }

  function articleCardHTML(a) {
    const done = isDone(a.id);
    return `<a class="article-card" href="#/edukasi" data-article-id="${a.id}">
      <span class="article-card-top">${articleMetaHTML(a)}</span>
      <h3>${escapeHTML(a.title)}</h3>
      <p>${escapeHTML(a.excerpt)}</p>
      <span class="article-card-foot"><span class="read">Baca materi ${icon("arrow-right")}</span>${done ? `<span class="done-mark">${icon("check")} Selesai</span>` : `<span class="minutes">${escapeHTML(a.level)}</span>`}</span>
    </a>`;
  }

  function renderArticleResults() {
    const featuredWrap = $("#eduFeatured");
    const grid = $("#articleGrid");
    const empty = $("#articleEmpty");
    if (!featuredWrap || !grid) return;
    const results = state.articles.filter(eduMatches);
    const showFeatured = !state.eduSearch.trim() && state.eduFilter === "all";
    const featured = showFeatured ? results.find((a) => a.featured) : null;
    const gridItems = featured ? results.filter((a) => a.id !== featured.id) : results;
    featuredWrap.innerHTML = featured ? `<a class="feature-article" href="#/edukasi" data-article-id="${featured.id}">
      <span class="feature-article-img"><img src="${featured.image || "assets/img/kuliner.jpg"}" alt=""></span>
      <span class="feature-article-body">
        <span class="meta"><span class="badge badge-sun">Pilihan</span><span class="badge">${escapeHTML(featured.category)}</span></span>
        <h2>${escapeHTML(featured.title)}</h2>
        <p>${escapeHTML(featured.excerpt)}</p>
        <span class="feature-article-foot"><span class="read-link">Baca materi ${icon("arrow-right")}</span><span>${icon("clock")} ${featured.minutes} menit</span><span>${escapeHTML(featured.level)}</span>${isDone(featured.id) ? `<span class="done-mark">${icon("check")} Selesai</span>` : ""}</span>
      </span>
    </a>` : "";
    grid.innerHTML = gridItems.map(articleCardHTML).join("");
    if (empty) empty.hidden = gridItems.length > 0 || !!featured;
    if (results.length === 0 && empty) {
      grid.innerHTML = "";
      empty.hidden = false;
    }
    const resultsLabel = $("#eduResultCount");
    if (resultsLabel) resultsLabel.textContent = `${results.length} materi`;
  }

  function setEduFilter(filter) {
    state.eduFilter = filter;
    renderEduFilters();
    renderArticleResults();
    const toolbar = $("#view-edukasi .edu-toolbar");
    if (toolbar && filter !== "all") toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* Quiz */
  function renderQuiz() {
    const card = $("#quizCard");
    if (!card) return;
    const q = D.quiz[state.quiz.index];
    if (state.quiz.finished) {
      const pct = Math.round((state.quiz.score / D.quiz.length) * 100);
      if (pct > state.quizBest) { state.quizBest = pct; LS.set("quizBest", pct); }
      renderCertificateBanner();
      const copy = pct === 100 ? "Paham betul. Anda siap menjelaskan ke rekan usaha." : pct >= 75 ? "Sudah kuat. Baca ulang satu materi yang tadi keliru, lalu coba lagi." : pct >= 50 ? "Cukup. Mulai dari jalur Dasar Pajak Daerah untuk memperkuat pemahaman." : "Tidak masalah. Mulai dari materi lima menit, lalu ulangi kuis ini.";
      card.innerHTML = `<div class="quiz-result">
        <div class="quiz-result-ring" style="--score:${pct}"><span>${state.quiz.score}/${D.quiz.length}</span></div>
        <h3>${pct === 100 ? "Semua tepat." : pct >= 75 ? "Hampir sempurna." : pct >= 50 ? "Sudah ada dasar." : "Ayo mulai lagi."}</h3>
        <p>${escapeHTML(copy)}</p>
        <div style="display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin-top:4px"><button class="btn btn-primary" type="button" data-quiz-restart>${icon("refresh-cw")} Ulangi kuis</button><button class="btn btn-secondary" type="button" data-open-certificate>${icon("badge-check")} Sertifikat</button></div>
        <a class="text-link" href="#/edukasi" data-path="dasar" style="margin-top:14px">Lihat jalur dasar ${icon("arrow-right")}</a>
      </div>`;
      return;
    }
    const selected = state.quiz.selected;
    const answered = state.quiz.answered;
    const isCorrect = selected === q.answer;
    card.innerHTML = `<div class="quiz-top"><div class="quiz-progress">${D.quiz.map((_, i) => `<span class="quiz-dot ${i < state.quiz.index ? "done" : i === state.quiz.index ? "active" : ""}"></span>`).join("")}</div><span class="quiz-step">PERTANYAAN ${state.quiz.index + 1} / ${D.quiz.length}</span></div>
      <h3>${escapeHTML(q.q)}</h3>
      <div class="quiz-options">${q.options.map((opt, i) => {
        let cls = "quiz-option";
        if (answered) {
          if (i === q.answer) cls += " correct";
          if (i === selected && i !== q.answer) cls += " wrong";
        } else if (selected === i) cls += " selected";
        return `<button class="${cls}" type="button" data-quiz-option="${i}" ${answered ? 'aria-disabled="true"' : ""}><span class="letter">${String.fromCharCode(65 + i)}</span><span>${escapeHTML(opt)}</span></button>`;
      }).join("")}</div>
      ${answered ? `<div class="quiz-feedback"><strong>${isCorrect ? "Tepat." : "Belum tepat."}</strong>${escapeHTML(q.why)}</div><button class="btn btn-primary" type="button" data-quiz-next>${state.quiz.index === D.quiz.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya"} ${icon("arrow-right")}</button>` : `<p class="micro" style="margin-top:12px">Pilih satu jawaban untuk melihat penjelasan.</p>`}`;
  }

  /* ============================================================
     JENIS PAJAK
     ============================================================ */
  function renderTaxPage() {
    const list = $("#taxList");
    if (!list) return;
    list.innerHTML = D.taxes.map((t) => `<a class="tax-row" href="#/pajak" data-tax-id="${t.id}">
      <span class="tax-row-icon tone-${t.tone}">${icon(t.icon)}</span>
      <span class="tax-row-main"><h3>${escapeHTML(t.name)}</h3><span class="long">${escapeHTML(t.long)}</span><p>${escapeHTML(t.summary)}</p></span>
      <span class="tax-row-meta"><strong>${escapeHTML(t.rate)}</strong><span>${escapeHTML(t.period)}</span></span>
      ${icon("arrow-up-right")}
    </a>`).join("");
    initReveals($("#view-pajak"));
  }

  /* ============================================================
     KALKULATOR
     ============================================================ */
  const calcConfigs = {
    pbjt: {
      fields: [
        { id: "subtype", label: "Jenis layanan", type: "select", options: ["Makanan & minuman", "Perhotelan", "Hiburan", "Parkir"], helper: "Pilih objek yang paling dekat dengan kegiatan usaha." },
        { id: "rate", label: "Tarif simulasi (%)", type: "number", step: "0.1", min: "0", max: "10", helper: "Tarif paling tinggi 10%. Angka ini untuk simulasi." },
        { id: "omzet", label: "Omzet masa pajak", type: "money", full: true, helper: "Jumlah pembayaran yang diterima pada satu masa pajak." }
      ],
      defaults: { subtype: "Makanan & minuman", rate: 10, omzet: 25000000 },
      compute(v) {
        const base = num(v.omzet);
        const rate = num(v.rate);
        const tax = base * rate / 100;
        return { tax, rows: [["Omzet / dasar", rp(base)], ["Tarif simulasi", rate + "%"], ["Perkiraan PBJT", rp(tax)]], base };
      }
    },
    pbb: {
      fields: [
        { id: "bumi", label: "NJOP bumi", type: "money", helper: "Nilai tanah menurut SPPT atau data objek." },
        { id: "bangunan", label: "NJOP bangunan", type: "money", helper: "Nilai bangunan menurut data objek." },
        { id: "njoptkp", label: "NJOPTKP (pengurang)", type: "money", helper: "Nilai tidak kena pajak. Contoh ilustrasi Rp10 juta." },
        { id: "rate", label: "Tarif simulasi (%)", type: "number", step: "0.01", min: "0", max: "0.3", helper: "Tarif PBB-P2 paling tinggi 0,3%." }
      ],
      defaults: { bumi: 300000000, bangunan: 200000000, njoptkp: 10000000, rate: 0.2 },
      compute(v) {
        const njop = num(v.bumi) + num(v.bangunan);
        const base = Math.max(0, njop - num(v.njoptkp));
        const rate = num(v.rate);
        const tax = base * rate / 100;
        return { tax, rows: [["Total NJOP", rp(njop)], ["NJOPTKP", "− " + rp(num(v.njoptkp))], ["Dasar perhitungan", rp(base)], ["Tarif simulasi", rate + "%"], ["Perkiraan PBB-P2", rp(tax)]], base };
      }
    },
    bphtb: {
      fields: [
        { id: "npop", label: "Nilai perolehan objek (NPOP)", type: "money", full: true, helper: "Nilai transaksi atau nilai pasar sesuai ketentuan." },
        { id: "npoptkp", label: "NPOPTKP (pengurang)", type: "money", helper: "Contoh ilustrasi Rp60 juta. Perlakuan khusus dapat berbeda." },
        { id: "rate", label: "Tarif simulasi (%)", type: "number", step: "0.1", min: "0", max: "5", helper: "Tarif umum BPHTB adalah 5%." }
      ],
      defaults: { npop: 800000000, npoptkp: 60000000, rate: 5 },
      compute(v) {
        const base = Math.max(0, num(v.npop) - num(v.npoptkp));
        const rate = num(v.rate);
        const tax = base * rate / 100;
        return { tax, rows: [["NPOP", rp(num(v.npop))], ["NPOPTKP", "− " + rp(num(v.npoptkp))], ["Dasar perhitungan", rp(base)], ["Tarif simulasi", rate + "%"], ["Perkiraan BPHTB", rp(tax)]], base };
      }
    },
    reklame: {
      fields: [
        { id: "dasar", label: "Nilai dasar reklame", type: "money", full: true, helper: "Gunakan nilai sewa, kontrak, atau dasar lain sesuai ketentuan." },
        { id: "rate", label: "Tarif simulasi (%)", type: "number", step: "0.1", min: "0", max: "100", helper: "Tarif resmi berbeda menurut media, ukuran, lokasi, dan durasi." }
      ],
      defaults: { dasar: 10000000, rate: 15 },
      compute(v) {
        const base = num(v.dasar);
        const rate = num(v.rate);
        const tax = base * rate / 100;
        return { tax, rows: [["Nilai dasar", rp(base)], ["Tarif simulasi", rate + "%"], ["Perkiraan pajak reklame", rp(tax)]], base };
      }
    },
    pat: {
      fields: [
        { id: "volume", label: "Volume pemakaian (m³)", type: "number", step: "1", min: "0", helper: "Gunakan volume satu masa pajak." },
        { id: "tarif", label: "Tarif per m³", type: "money", helper: "Tarif ilustrasi. Nilai resmi mengikuti ketentuan daerah." }
      ],
      defaults: { volume: 100, tarif: 10000 },
      compute(v) {
        const volume = num(v.volume);
        const tarif = num(v.tarif);
        const tax = volume * tarif;
        return { tax, rows: [["Volume", fmtNum(volume) + " m³"], ["Tarif per m³", rp(tarif)], ["Perkiraan pajak air tanah", rp(tax)]], base: tax };
      }
    }
  };

  function ensureCalcValues(type) {
    const cfg = calcConfigs[type];
    if (!cfg) return {};
    if (!state.calcValues[type]) state.calcValues[type] = { ...cfg.defaults };
    return state.calcValues[type];
  }

  function calcFieldHTML(field, value) {
    const wrapClass = "form-field" + (field.full ? " form-field--full" : "");
    const helper = field.helper ? `<span class="hint">${escapeHTML(field.helper)}</span>` : "";
    if (field.type === "select") {
      return `<div class="${wrapClass}"><label for="calc-${field.id}">${escapeHTML(field.label)}</label><select class="select" id="calc-${field.id}" data-calc-field="${field.id}">${field.options.map((o) => `<option ${o === value ? "selected" : ""}>${escapeHTML(o)}</option>`).join("")}</select>${helper}</div>`;
    }
    if (field.type === "money") {
      return `<div class="${wrapClass}"><label for="calc-${field.id}">${escapeHTML(field.label)}</label><div class="input-money-wrap"><span>Rp</span><input class="input" id="calc-${field.id}" data-calc-field="${field.id}" data-money inputmode="numeric" autocomplete="off" value="${fmtNum(num(value))}"></div>${helper}</div>`;
    }
    return `<div class="${wrapClass}"><label for="calc-${field.id}">${escapeHTML(field.label)}</label><input class="input" id="calc-${field.id}" type="number" inputmode="decimal" data-calc-field="${field.id}" step="${field.step || "1"}" min="${field.min || "0"}" value="${escapeHTML(value)}">${helper}</div>`;
  }

  function renderCalculator() {
    const tabs = $("#calcTabs");
    if (!tabs) return;
    tabs.innerHTML = D.taxes.map((t) => `<button class="tax-tab ${state.calcType === t.id ? "active" : ""}" type="button" role="tab" aria-selected="${state.calcType === t.id}" data-calc-tab="${t.id}">${icon(t.icon)} ${escapeHTML(t.name)}</button>`).join("");
    const tax = taxById(state.calcType) || D.taxes[0];
    const cfg = calcConfigs[state.calcType] || calcConfigs.pbjt;
    $("#calcTitle").textContent = tax.name;
    $("#calcSubtitle").textContent = tax.long;
    $("#calcRateBadge").textContent = tax.rate;
    const values = ensureCalcValues(state.calcType);
    $("#calcFields").innerHTML = cfg.fields.map((f) => calcFieldHTML(f, values[f.id])).join("");
    updateCalcResult();
    initReveals($("#view-kalkulator"));
  }

  function updateCalcResult() {
    const type = state.calcType;
    const cfg = calcConfigs[type];
    const tax = taxById(type);
    if (!cfg || !tax) return;
    const values = ensureCalcValues(type);
    const result = cfg.compute(values);
    const amount = result.tax;
    const valueEl = $("#resultValue");
    if (valueEl) valueEl.textContent = rp(amount);
    const caption = $("#resultCaption");
    if (caption) caption.textContent = amount > 0 ? `Perkiraan untuk ${tax.name} berdasarkan angka yang Anda masukkan.` : "Masukkan nilai untuk melihat perkiraan.";
    const status = $("#resultStatus");
    if (status) {
      status.classList.toggle("is-ready", amount > 0);
      status.innerHTML = `<span></span> ${amount > 0 ? "Terhitung" : "Siap dihitung"}`;
    }
    const label = $("#resultLabel");
    if (label) label.textContent = `Perkiraan ${tax.name}`;
    const breakdown = $("#resultBreakdown");
    if (breakdown) breakdown.innerHTML = result.rows.slice(0, -1).map(([k, v]) => `<div class="row"><span>${escapeHTML(k)}</span><strong>${escapeHTML(v)}</strong></div>`).join("") + `<div class="row total"><span>Perkiraan pajak</span><strong>${rp(amount)}</strong></div>`;
  }

  function readCalcValues() {
    const values = ensureCalcValues(state.calcType);
    $$("#calcFields [data-calc-field]").forEach((input) => {
      values[input.dataset.calcField] = input.type === "number" ? num(input.value) : input.value;
    });
    return values;
  }

  function calcSummaryText() {
    const tax = taxById(state.calcType);
    const values = ensureCalcValues(state.calcType);
    const result = calcConfigs[state.calcType].compute(values);
    return `${tax.name} — simulasi PESONA\n${result.rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nHasil simulasi, bukan ketetapan pajak.`;
  }

  function openConsultation(prefill = {}) {
    const topic = prefill.topic || "Perhitungan pajak";
    const message = prefill.message || "";
    openDialog(`<div class="wizard-head">
        <span class="mini-label">Konsultasi &amp; pengaduan</span>
        <h2 id="dialogTitle">Tanya petugas PESONA</h2>
        <p>Tulis pertanyaan Anda. Pada prototipe ini, tiket tidak dikirim ke petugas sungguhan.</p>
      </div>
      <form id="consultationForm" novalidate>
        <div class="wizard-body">
          <div class="form-grid">
            <div class="form-field"><label for="consName">Nama</label><input class="input" id="consName" name="name" autocomplete="name" placeholder="Nama lengkap" value="${escapeHTML(state.account ? D.demoUser.name : "")}"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="consContact">WhatsApp atau email</label><input class="input" id="consContact" name="contact" placeholder="0812... atau nama@email.com"><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="consTopic">Topik</label><select class="select" id="consTopic" name="topic">${["Perhitungan pajak", "Pendaftaran NPWPD", "Pelaporan", "Pembayaran", "Pengaduan layanan", "Lainnya"].map((t) => `<option ${t === topic ? "selected" : ""}>${t}</option>`).join("")}</select></div>
            <div class="form-field form-field--full"><label for="consMessage">Pertanyaan atau kronologi</label><textarea class="input" id="consMessage" name="message" rows="5" placeholder="Tuliskan pertanyaan dengan jelas. Jangan menyertakan data pribadi sensitif.">${escapeHTML(message)}</textarea><span class="hint">Jangan mengirim NIK, nomor rekening, atau dokumen asli melalui kanal ini.</span><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><span class="hint">Kanal respons</span><div class="radio-cards"><label class="radio-card"><input type="radio" name="channel" value="WhatsApp" checked><span class="radio-dot"></span><span>WhatsApp</span></label><label class="radio-card"><input type="radio" name="channel" value="Email"><span class="radio-dot"></span><span>Email</span></label></div></div>
          </div>
          <label class="consent-row"><input type="checkbox" name="consent"> <span>Saya memahami ini adalah prototipe dan tidak ada pertanyaan yang dikirim ke layanan resmi.</span></label>
          <span class="field-error" data-consent-error hidden></span>
        </div>
        <div class="wizard-foot"><span class="micro">Respons contoh: 1 hari kerja</span><button class="btn btn-primary" type="submit">Kirim pertanyaan ${icon("send")}</button></div>
      </form>`);
  }

  function submitConsultation(form) {
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const message = String(data.get("message") || "").trim();
    const consent = data.get("consent");
    let bad = false;
    bad = setFieldError(form, "name", name.length < 2 ? "Nama minimal 2 karakter." : "") || bad;
    bad = setFieldError(form, "contact", contact.length < 5 ? "Isi kontak yang bisa dihubungi." : "") || bad;
    bad = setFieldError(form, "message", message.length < 8 ? "Tuliskan pertanyaan minimal 8 karakter." : "") || bad;
    const consentErr = form.querySelector("[data-consent-error]");
    if (!consent) { consentErr.hidden = false; consentErr.textContent = "Centang pernyataan sebelum mengirim."; bad = true; } else consentErr.hidden = true;
    if (bad) { toast("error", "Periksa formulir", "Ada kolom yang belum lengkap."); return; }
    const now = new Date();
    const code = `PSN-${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(4000 + Math.floor(Math.random() * 900))}`;
    const ticket = { code, name, contact, topic: String(data.get("topic") || "Lainnya"), message, channel: String(data.get("channel") || "WhatsApp"), date: fmtDateTime(now), status: "Baru" };
    state.tickets.unshift(ticket);
    LS.set("tickets", state.tickets);
    closeDialog();
    setTimeout(() => {
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Pertanyaan tercatat.</h2>
        <p>Tiket konsultasi contoh berhasil dibuat. Petugas pada prototipe ini tidak benar-benar merespons.</p>
        <div class="success-code">${icon("ticket")} <span>${code}</span></div>
        <div class="success-meta"><div><span>Topik</span><strong>${escapeHTML(ticket.topic)}</strong></div><div><span>Kanal</span><strong>${escapeHTML(ticket.channel)}</strong></div><div><span>Respons contoh</span><strong>1 hari kerja</strong></div></div>
        <div class="success-actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${code}">${icon("copy")} Salin kode</button>
          <button class="btn btn-primary" type="button" data-check-code="${code}">${icon("clipboard-check")} Cek status</button>
        </div>
      </div>`);
      toast("success", "Tiket dibuat", code + " · " + ticket.topic);
    }, 120);
  }

  /* ============================================================
     LAYANAN
     ============================================================ */
  const serviceTone = { forest: "forest", peach: "peach", mint: "mint", sand: "sand" };

  function renderServicesPage() {
    const grid = $("#serviceGrid");
    if (!grid) return;
    grid.innerHTML = D.services.map((s) => `<a class="service-card" href="#/layanan" data-open-service="${s.id}">
      <span class="service-card-top"><span class="service-icon tone-${serviceTone[s.tone] || "forest"}">${icon(s.icon)}</span><span class="badge badge-muted">${escapeHTML(s.tag)}</span></span>
      <h3>${escapeHTML(s.title)}</h3>
      <p>${escapeHTML(s.desc)}</p>
      <span class="service-card-foot"><span>${escapeHTML(s.meta)}</span><span class="go">${s.id === "status" ? "Buka pelacak" : "Mulai"} ${icon("arrow-right")}</span></span>
    </a>`).join("");
    renderStatusResult(state.statusResult || D.sampleStatuses[0], !state.statusResult);
    restoreChecklist();
    initReveals($("#view-layanan"));
  }

  function statusTone(status) {
    const s = String(status || "").toLowerCase();
    if (s.includes("selesai") || s.includes("terbit") || s.includes("dibayar") || s.includes("berhasil") || s.includes("terkonfirmasi") || s.includes("terverifikasi")) return "ok";
    if (s.includes("tolak") || s.includes("kembali")) return "danger";
    if (s.includes("proses") || s.includes("verifikasi") || s.includes("menunggu") || s.includes("perlu") || s.includes("dalam")) return "warn";
    return "info";
  }

  function allStatuses() {
    const dynamic = [];
    state.registrations.forEach((r) => {
      dynamic.push({
        code: r.code,
        type: "Pendaftaran NPWPD",
        subject: `${r.data.usaha || r.data.nama} · ${r.data.wilayah || "Klungkung"}`,
        status: state.queueOverrides[r.code] || r.status || "Menunggu verifikasi",
        updated: r.date,
        steps: [
          { date: r.date, title: "Permohonan diterima", desc: "Data dan dokumen awal tercatat pada prototipe.", state: "done" },
          { date: "Berikutnya", title: "Verifikasi dokumen", desc: "Petugas mencocokkan identitas dan data usaha.", state: "active" },
          { date: "Menunggu", title: "NPWPD terbit", desc: "Nomor wajib pajak dapat digunakan setelah verifikasi.", state: "todo" }
        ],
        note: "Status contoh dari permohonan yang Anda buat di prototipe ini."
      });
    });
    state.reports.forEach((r) => {
      dynamic.push({
        code: r.code,
        type: "Pelaporan " + r.taxName,
        subject: `${r.name} · ${r.periodLabel}`,
        status: state.queueOverrides[r.code] || r.status || "Menunggu verifikasi",
        updated: r.date,
        steps: [
          { date: r.date, title: "Laporan diterima", desc: "Ringkasan masa pajak berhasil dibuat.", state: "done" },
          { date: "Berikutnya", title: "Pemeriksaan data", desc: "Petugas mencocokkan nilai dengan data pendukung.", state: "active" },
          { date: "Menunggu", title: "Selesai diverifikasi", desc: "Status diperbarui setelah pemeriksaan.", state: "todo" }
        ],
        note: "Simulasi pelaporan. Tidak ada data yang dikirim ke sistem resmi."
      });
    });
    state.tickets.forEach((t) => {
      dynamic.push({
        code: t.code,
        type: "Tiket konsultasi",
        subject: t.topic,
        status: state.queueOverrides[t.code] || (t.status === "Selesai" ? "Selesai" : "Menunggu respons"),
        updated: t.date,
        steps: [
          { date: t.date, title: "Tiket dibuat", desc: "Pertanyaan tercatat pada prototipe.", state: "done" },
          { date: "Berikutnya", title: "Dijawab petugas", desc: "Respons contoh dikirim melalui kanal pilihan.", state: "active" }
        ],
        note: "Tiket ini hanya tersimpan di browser Anda."
      });
    });
    state.providers.forEach((p) => {
      const status = p.status || "Dalam verifikasi";
      dynamic.push({
        code: p.code,
        type: "Pendaftaran penyedia",
        subject: `${p.name} · ${p.area}`,
        status,
        updated: p.submitted,
        steps: [
          { date: p.submitted, title: "Pengajuan diterima", desc: "Profil dan dokumen dasar tercatat pada prototipe.", state: "done" },
          { date: "Berikutnya", title: "Verifikasi dokumen", desc: "NIB, NPWPD, dan sertifikasi dicocokkan petugas.", state: status === "Dalam verifikasi" ? "active" : "done" },
          { date: "Menunggu", title: "Keputusan registry", desc: "Jika lolos, usaha tampil di registry dan dapat menerima booking.", state: status === "Terverifikasi" ? "done" : "todo" }
        ],
        note: "Status contoh dari pengajuan penyedia yang Anda buat di prototipe ini."
      });
    });
    state.bookings.forEach((b) => {
      dynamic.push({
        code: b.code,
        type: "Booking penyedia",
        subject: `${b.provider} · ${b.qty} ${b.unit || "unit"} · ${b.date}`,
        status: b.status,
        updated: b.created,
        steps: [
          { date: b.created, title: "Booking dibuat", desc: "Detail tanggal, jumlah, dan kontak tercatat.", state: "done" },
          { date: b.created, title: "Pembayaran QRIS simulasi", desc: "PBJT ilustrasi dihitung pada ringkasan.", state: "done" },
          { date: b.date, title: "Hari kedatangan", desc: "Tunjukkan kode booking kepada penyedia.", state: "active" }
        ],
        note: "Booking simulasi. Tidak ada pembayaran nyata pada prototipe ini."
      });
    });
    state.trainingRegs.forEach((t) => {
      dynamic.push({
        code: t.code,
        type: "Pendaftaran pelatihan",
        subject: `${t.name} · ${t.role}`,
        status: t.status,
        updated: t.date,
        steps: [
          { date: t.date, title: "Pendaftaran diterima", desc: "Data peserta tercatat pada prototipe.", state: "done" },
          { date: "Berikutnya", title: "Konfirmasi penyelenggara", desc: "Jadwal dan kuota dikonfirmasi melalui kanal contoh.", state: "active" },
          { date: "Menunggu", title: "Pelatihan dimulai", desc: "Peserta mengikuti sesi dan uji kompetensi bila tersedia.", state: "todo" }
        ],
        note: "Pendaftaran ini hanya tersimpan di browser Anda."
      });
    });
    state.appointments.forEach((a) => {
      dynamic.push({
        code: a.code,
        type: "Janji temu Meja PAD",
        subject: `${a.purpose} · ${a.channel}`,
        status: a.status,
        updated: a.created,
        steps: [
          { date: a.created, title: "Slot dipilih", desc: "Tanggal, waktu, dan topik konsultasi tercatat.", state: "done" },
          { date: "Berikutnya", title: "Konfirmasi petugas", desc: "Petugas mengonfirmasi kehadiran melalui kanal pilihan.", state: "active" },
          { date: a.date, title: "Sesi konsultasi", desc: `${a.time} · ${a.channel}`, state: "todo" }
        ],
        note: "Janji temu simulasi. Tidak ada pemesanan nyata."
      });
    });
    return [...dynamic, ...D.sampleStatuses];
  }

  function renderStatusResult(entry, isSample = false) {
    const box = $("#statusResult");
    if (!box) return;
    if (!entry) {
      box.innerHTML = `<div class="status-empty"><span class="empty-icon">${icon("clipboard-check")}</span><h3>Kode tidak ditemukan.</h3><p>Periksa kembali kode referensi atau coba salah satu contoh di samping.</p></div>`;
      return;
    }
    box.innerHTML = `<div class="status-summary">
      <div><span class="mini-label">${isSample ? "Contoh status" : "Status ditemukan"}</span><h3>${escapeHTML(entry.type)}</h3><p>${escapeHTML(entry.subject)}</p><span class="status-code">${escapeHTML(entry.code)}</span></div>
      <span class="status-chip ${statusTone(entry.status)}">${escapeHTML(entry.status)}</span>
    </div>
    <div class="timeline">${entry.steps.map((s) => `<div class="timeline-item ${s.state || ""}"><span class="timeline-dot"></span><div><h4>${escapeHTML(s.title)}</h4><p>${escapeHTML(s.desc)}</p><span class="tl-date">${escapeHTML(s.date)}</span></div></div>`).join("")}</div>
    <p class="status-note">${escapeHTML(entry.note || "")}</p>
    <div class="status-actions">
      <button class="btn btn-secondary btn-sm" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya petugas</button>
      <button class="btn btn-ghost btn-sm" type="button" data-copy-text="${escapeHTML(entry.code)}">${icon("copy")} Salin kode</button>
    </div>`;
  }

  function checkStatusCode(code, silent = false) {
    const clean = String(code || "").trim().toUpperCase();
    const err = $("#statusError");
    if (!clean) {
      if (err) { err.hidden = false; err.textContent = "Masukkan kode referensi terlebih dahulu."; }
      $("#statusCode")?.focus();
      return;
    }
    if (err) err.hidden = true;
    const entry = allStatuses().find((s) => s.code.toUpperCase() === clean);
    if (entry) {
      state.statusResult = entry;
      renderStatusResult(entry, false);
      if (!silent) toast("success", "Status ditemukan", entry.code + " · " + entry.status);
      $("#statusResult")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      renderStatusResult(null, false);
      if (err) { err.hidden = false; err.textContent = "Kode tidak ditemukan pada data demo. Coba contoh kode di bawah."; }
      if (!silent) toast("error", "Kode tidak ditemukan", "Gunakan salah satu contoh kode yang tersedia.");
    }
  }

  function jumpToStatus(code) {
    closeDialog();
    state.statusResult = null;
    if (state.currentView !== "layanan") {
      state.pendingService = "status";
      go("#/layanan");
      setTimeout(() => {
        const input = $("#statusCode");
        if (input && code) { input.value = code; checkStatusCode(code); }
      }, 260);
    } else {
      const input = $("#statusCode");
      if (input) input.value = code;
      $("#status-checker")?.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => checkStatusCode(code), 350);
    }
  }

  function restoreChecklist() {
    $$("#docChecklist input[type=checkbox]").forEach((cb) => { cb.checked = state.docChecks.has(cb.value); });
    updateDocProgress();
  }
  function updateDocProgress() {
    const checks = $$("#docChecklist input[type=checkbox]");
    const done = checks.filter((c) => c.checked).length;
    state.docChecks = new Set(checks.filter((c) => c.checked).map((c) => c.value));
    LS.set("docChecks", Array.from(state.docChecks));
    const label = $("#docProgress");
    if (label) label.textContent = `${done}/${checks.length}`;
  }

  function openService(id) {
    if (id === "status") {
      closeDialog();
      if (state.currentView !== "layanan") {
        state.pendingService = "status";
        go("#/layanan");
      } else {
        $("#status-checker")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => $("#statusCode")?.focus({ preventScroll: true }), 450);
      }
      return;
    }
    if (id === "daftar" || id === "lapor") { openWizard(id); return; }
    if (id === "izin") { jumpToStatus("IZIN-2026-0045"); return; }
    if (id === "temu") { openAppointment(); return; }
    if (id === "konsultasi") { openConsultation(); return; }
  }

  /* ============================================================
     WIZARD PENDAFTARAN & PELAPORAN
     ============================================================ */
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const taxRateDefaults = { pbjt: 10, pbb: 0.2, bphtb: 5, reklame: 15, pat: 100 };

  function defaultWizard(type) {
    const now = new Date();
    if (type === "lapor") {
      return {
        tax: "pbjt",
        npwpd: state.account ? D.demoUser.npwpd : "",
        periodMonth: String(now.getMonth() + 1),
        periodYear: String(now.getFullYear()),
        base: "",
        rate: 10,
        name: state.account ? D.demoUser.name : "",
        phone: "",
        email: "",
        method: "QRIS"
      };
    }
    return {
      jenis: "Perorangan",
      nama: "",
      nik: "",
      phone: "",
      email: "",
      usaha: "",
      jenisUsaha: "Makanan & minuman",
      alamat: "",
      wilayah: "Nusa Penida",
      omzet: "",
      files: {},
      docsReady: false,
      consent: false
    };
  }

  function openWizard(type) {
    state.wizard = { type, step: 0, data: defaultWizard(type), done: null };
    renderWizard();
  }

  function wizardProgressHTML(type, step) {
    const steps = D.serviceFlows[type].steps;
    return `<div class="wizard-steps">${steps.map((s, i) => `<span class="wizard-step-dot ${i === step ? "active" : i < step ? "done" : ""}"><i>${i < step ? "✓" : i + 1}</i><span>${escapeHTML(s)}</span></span>`).join("")}</div>`;
  }

  function renderWizard() {
    const w = state.wizard;
    if (!w) return;
    if (w.done) { renderWizardSuccess(); return; }
    const meta = D.serviceFlows[w.type];
    const data = w.data;
    let body = "";
    if (w.type === "daftar") body = daftarStepHTML(w.step, data);
    else body = laporStepHTML(w.step, data);
    const nextLabel = w.step === meta.steps.length - 1 ? (w.type === "daftar" ? "Kirim permohonan" : "Buat kode billing") : "Lanjut";
    const html = `<div class="wizard-head">
        <span class="mini-label">${escapeHTML(meta.title)} · langkah ${w.step + 1} dari ${meta.steps.length}</span>
        <h2 id="dialogTitle">${escapeHTML(meta.title)}</h2>
        <p>${escapeHTML(meta.desc)} · ${escapeHTML(meta.sla)}.</p>
        ${wizardProgressHTML(w.type, w.step)}
      </div>
      <form id="wizardForm" novalidate>
        <div class="wizard-body">${body}</div>
        <div class="wizard-foot">
          <button class="btn btn-ghost" type="button" data-wizard-back ${w.step === 0 ? "disabled" : ""}>${icon("arrow-left")} Kembali</button>
          <span class="micro">Data tersimpan sementara di browser</span>
          <button class="btn btn-primary" type="submit">${nextLabel} ${icon("arrow-right")}</button>
        </div>
      </form>`;
    openDialog(html, { wide: true });
  }

  function daftarStepHTML(step, d) {
    if (step === 0) {
      return `<div class="wizard-intro"><h3>Identitas wajib pajak</h3><p>Gunakan data yang sama dengan dokumen resmi.</p></div>
        <div class="form-grid">
          <div class="form-field form-field--full"><span class="hint">Jenis wajib pajak</span><div class="radio-cards"><label class="radio-card"><input type="radio" name="jenis" value="Perorangan" ${d.jenis === "Perorangan" ? "checked" : ""}><span class="radio-dot"></span><span>Orang pribadi</span></label><label class="radio-card"><input type="radio" name="jenis" value="Badan" ${d.jenis === "Badan" ? "checked" : ""}><span class="radio-dot"></span><span>Badan usaha</span></label></div></div>
          <div class="form-field"><label for="wNama">Nama lengkap</label><input class="input" id="wNama" name="nama" autocomplete="name" value="${escapeHTML(d.nama)}" autofocus><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="wNik">NIK / nomor identitas</label><input class="input" id="wNik" name="nik" inputmode="numeric" value="${escapeHTML(d.nik)}" placeholder="16 digit"><span class="hint">Contoh saja. Jangan gunakan NIK sungguhan.</span><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="wPhone">Nomor WhatsApp</label><input class="input" id="wPhone" name="phone" inputmode="tel" value="${escapeHTML(d.phone)}" placeholder="0812..."><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="wEmail">Email <span style="color:var(--muted);font-weight:400">(opsional)</span></label><input class="input" id="wEmail" name="email" type="email" value="${escapeHTML(d.email)}" placeholder="nama@email.com"><span class="field-error" hidden></span></div>
        </div>`;
    }
    if (step === 1) {
      return `<div class="wizard-intro"><h3>Data usaha</h3><p>Isi sesuai lokasi dan kegiatan yang benar-benar berjalan.</p></div>
        <div class="form-grid">
          <div class="form-field"><label for="wUsaha">Nama usaha</label><input class="input" id="wUsaha" name="usaha" value="${escapeHTML(d.usaha)}" autofocus><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="wJenisUsaha">Jenis kegiatan</label><select class="select" id="wJenisUsaha" name="jenisUsaha">${["Makanan & minuman", "Perhotelan / homestay", "Hiburan", "Parkir", "Reklame", "Air tanah", "Lainnya"].map((x) => `<option ${x === d.jenisUsaha ? "selected" : ""}>${x}</option>`).join("")}</select></div>
          <div class="form-field form-field--full"><label for="wAlamat">Alamat usaha</label><input class="input" id="wAlamat" name="alamat" value="${escapeHTML(d.alamat)}" placeholder="Nama jalan, banjar, desa"><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="wWilayah">Kecamatan</label><select class="select" id="wWilayah" name="wilayah">${D.regions.map((r) => `<option ${r === d.wilayah ? "selected" : ""}>${r}</option>`).join("")}</select></div>
          <div class="form-field"><label for="wOmzet">Perkiraan omzet / bulan</label><div class="input-money-wrap"><span>Rp</span><input class="input" id="wOmzet" name="omzet" data-money inputmode="numeric" value="${fmtNum(num(d.omzet))}" autocomplete="off"></div><span class="hint">Boleh dikosongkan jika belum ada.</span></div>
        </div>`;
    }
    if (step === 2) {
      const file = (key, label, hint) => {
        const name = d.files && d.files[key];
        return `<div class="form-field form-field--full"><span class="hint">${label}</span><label class="upload-box">${icon("file-text")}<strong>${name ? "Dokumen terpilih" : "Pilih dokumen contoh"}</strong><span>${name ? escapeHTML(name) : hint}</span><input type="file" data-upload="${key}" accept=".pdf,.jpg,.jpeg,.png"></label>${name ? `<span class="upload-file">${icon("check")} ${escapeHTML(name)}</span>` : ""}</div>`;
      };
      return `<div class="wizard-intro"><h3>Dokumen pendukung</h3><p>Pada prototipe, file tidak diunggah atau dibaca. Nama file hanya disimpan di browser.</p></div>
        ${file("ktp", "KTP pemilik / penanggung jawab", "PDF, JPG, atau PNG")}
        ${file("nib", "NIB atau izin usaha", "PDF, JPG, atau PNG")}
        <label class="consent-row"><input type="checkbox" name="docsReady" ${d.docsReady ? "checked" : ""}> <span>Saya sudah menyiapkan dokumen di atas untuk proses verifikasi.</span></label>
        <span class="field-error" data-docs-error hidden></span>`;
    }
    return `<div class="wizard-intro"><h3>Tinjau permohonan</h3><p>Pastikan data sudah sesuai. Anda dapat kembali untuk memperbaiki.</p></div>
      <div class="review-block"><div class="review-block-head"><strong>Identitas</strong><button type="button" data-wizard-edit="0">Ubah</button></div><div class="review-rows">
        <div class="review-row"><span>Jenis</span><strong>${escapeHTML(d.jenis)}</strong></div><div class="review-row"><span>Nama</span><strong>${escapeHTML(d.nama)}</strong></div><div class="review-row"><span>NIK</span><strong>${escapeHTML(d.nik)}</strong></div><div class="review-row"><span>Kontak</span><strong>${escapeHTML(d.phone)}${d.email ? " · " + escapeHTML(d.email) : ""}</strong></div>
      </div></div>
      <div class="review-block"><div class="review-block-head"><strong>Usaha</strong><button type="button" data-wizard-edit="1">Ubah</button></div><div class="review-rows">
        <div class="review-row"><span>Nama usaha</span><strong>${escapeHTML(d.usaha)}</strong></div><div class="review-row"><span>Kegiatan</span><strong>${escapeHTML(d.jenisUsaha)}</strong></div><div class="review-row"><span>Alamat</span><strong>${escapeHTML(d.alamat)}</strong></div><div class="review-row"><span>Kecamatan</span><strong>${escapeHTML(d.wilayah)}</strong></div><div class="review-row"><span>Omzet</span><strong>${d.omzet ? rp(num(d.omzet)) : "Belum diisi"}</strong></div>
      </div></div>
      <label class="consent-row"><input type="checkbox" name="consent" ${d.consent ? "checked" : ""}> <span>Saya menyatakan data ini benar dan memahami bahwa prototipe tidak menerbitkan NPWPD resmi.</span></label>
      <span class="field-error" data-consent-error hidden></span>`;
  }

  function laporStepHTML(step, d) {
    const selected = taxById(d.tax) || D.taxes[0];
    if (step === 0) {
      return `<div class="wizard-intro"><h3>Pilih kewajiban</h3><p>Gunakan nomor NPWPD yang ingin disimulasikan.</p></div>
        <div class="form-grid">
          <div class="form-field form-field--full"><label for="lTax">Jenis pajak</label><select class="select" id="lTax" name="tax" data-tax-select>${D.taxes.map((t) => `<option value="${t.id}" ${t.id === d.tax ? "selected" : ""}>${escapeHTML(t.name)} — ${escapeHTML(t.long)}</option>`).join("")}</select></div>
          <div class="form-field form-field--full"><label for="lNpwpd">NPWPD</label><input class="input" id="lNpwpd" name="npwpd" value="${escapeHTML(d.npwpd)}" placeholder="NPWPD-2024-00871" autofocus><span class="hint">Contoh: NPWPD-2024-00871. Bukan data resmi.</span><span class="field-error" hidden></span></div>
        </div>`;
    }
    if (step === 1) {
      const helper = d.tax === "pbb" ? "Gunakan NJOP setelah dikurangi NJOPTKP." : d.tax === "bphtb" ? "Gunakan NPOP setelah dikurangi NPOPTKP." : d.tax === "pat" ? "Masukkan nilai perolehan air. Tarif 100% dipakai sebagai ilustrasi." : "Gunakan nilai dasar satu masa pajak.";
      return `<div class="wizard-intro"><h3>Masa pajak dan nilai</h3><p>Angka ini dipakai untuk menghitung ringkasan simulasi.</p></div>
        <div class="form-grid">
          <div class="form-field"><label for="lMonth">Bulan masa pajak</label><select class="select" id="lMonth" name="periodMonth">${monthsShort.map((m, i) => `<option value="${i + 1}" ${String(i + 1) === String(d.periodMonth) ? "selected" : ""}>${m}</option>`).join("")}</select></div>
          <div class="form-field"><label for="lYear">Tahun</label><select class="select" id="lYear" name="periodYear">${["2026", "2025"].map((y) => `<option ${y === String(d.periodYear) ? "selected" : ""}>${y}</option>`).join("")}</select></div>
          <div class="form-field form-field--full"><label for="lBase">Nilai dasar</label><div class="input-money-wrap"><span>Rp</span><input class="input" id="lBase" name="base" data-money inputmode="numeric" value="${fmtNum(num(d.base))}" autocomplete="off"></div><span class="hint">${helper}</span><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="lRate">Tarif simulasi (%)</label><input class="input" id="lRate" name="rate" type="number" step="0.1" min="0" value="${escapeHTML(d.rate)}"><span class="hint">Tarif ilustrasi, bukan ketetapan.</span><span class="field-error" hidden></span></div>
          <div class="form-field"><span class="hint">Perkiraan pajak</span><div style="font-family:var(--display);font-size:1.4rem;font-weight:680;color:var(--brand)" id="wizardTaxPreview">${rp(num(d.base) * num(d.rate) / 100)}</div></div>
        </div>`;
    }
    if (step === 2) {
      return `<div class="wizard-intro"><h3>Kontak pelapor</h3><p>Data ini hanya ditampilkan pada simulasi.</p></div>
        <div class="form-grid">
          <div class="form-field"><label for="lName">Nama pelapor</label><input class="input" id="lName" name="name" value="${escapeHTML(d.name)}" autofocus><span class="field-error" hidden></span></div>
          <div class="form-field"><label for="lPhone">Nomor WhatsApp</label><input class="input" id="lPhone" name="phone" inputmode="tel" value="${escapeHTML(d.phone)}" placeholder="0812..."><span class="field-error" hidden></span></div>
          <div class="form-field form-field--full"><label for="lEmail">Email <span style="color:var(--muted);font-weight:400">(opsional)</span></label><input class="input" id="lEmail" name="email" type="email" value="${escapeHTML(d.email)}" placeholder="nama@email.com"></div>
        </div>
        <div class="review-block" style="margin-top:18px"><div class="review-block-head"><strong>Ringkasan kewajiban</strong><button type="button" data-wizard-edit="1">Ubah</button></div><div class="review-rows">
          <div class="review-row"><span>Jenis</span><strong>${escapeHTML(selected.name)}</strong></div>
          <div class="review-row"><span>Masa</span><strong>${escapeHTML(monthsShort[Number(d.periodMonth) - 1] || "")} ${escapeHTML(d.periodYear)}</strong></div>
          <div class="review-row"><span>Nilai dasar</span><strong>${rp(num(d.base))}</strong></div>
          <div class="review-row"><span>Tarif</span><strong>${escapeHTML(d.rate)}%</strong></div>
          <div class="review-row"><span>Perkiraan pajak</span><strong>${rp(num(d.base) * num(d.rate) / 100)}</strong></div>
        </div></div>`;
    }
    return `<div class="wizard-intro"><h3>Pilih kanal pembayaran simulasi</h3><p>Tidak ada pembayaran nyata pada prototipe ini.</p></div>
      <div class="radio-cards" style="grid-template-columns:1fr">
        <label class="radio-card"><input type="radio" name="method" value="QRIS" ${d.method === "QRIS" ? "checked" : ""}><span class="radio-dot"></span><span><strong>QRIS</strong><br><small style="color:var(--muted);font-weight:400">Pindai dari aplikasi pembayaran. Contoh instruksi akan ditampilkan.</small></span></label>
        <label class="radio-card"><input type="radio" name="method" value="Virtual Account" ${d.method === "Virtual Account" ? "checked" : ""}><span class="radio-dot"></span><span><strong>Virtual account bank</strong><br><small style="color:var(--muted);font-weight:400">Gunakan nomor billing simulasi pada bank persepsi.</small></span></label>
        <label class="radio-card"><input type="radio" name="method" value="Teller" ${d.method === "Teller" ? "checked" : ""}><span class="radio-dot"></span><span><strong>Teller / meja layanan</strong><br><small style="color:var(--muted);font-weight:400">Bayar melalui kanal resmi dengan kode billing.</small></span></label>
      </div>
      <div class="review-block" style="margin-top:16px"><div class="review-block-head"><strong>Ringkasan</strong><button type="button" data-wizard-edit="1">Ubah</button></div><div class="review-rows">
        <div class="review-row"><span>NPWPD</span><strong>${escapeHTML(d.npwpd)}</strong></div>
        <div class="review-row"><span>Jenis pajak</span><strong>${escapeHTML(selected.name)}</strong></div>
        <div class="review-row"><span>Masa</span><strong>${escapeHTML(monthsShort[Number(d.periodMonth) - 1] || "")} ${escapeHTML(d.periodYear)}</strong></div>
        <div class="review-row"><span>Nominal</span><strong>${rp(num(d.base) * num(d.rate) / 100)}</strong></div>
      </div></div>
      <p class="micro" style="margin-top:12px">Dengan menekan tombol di bawah, Anda membuat kode billing contoh yang tidak dapat digunakan untuk pembayaran nyata.</p>`;
  }

  function setFieldError(form, name, message) {
    if (!form) return !!message;
    const input = form.querySelector(`[name="${name}"]`);
    if (!input) return !!message;
    const field = input.closest(".form-field");
    const error = field ? field.querySelector(".field-error") : null;
    if (error) {
      error.hidden = !message;
      error.textContent = message || "";
    }
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !!message;
  }

  function collectWizardData() {
    const form = $("#wizardForm");
    if (!form) return;
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (key === "docsReady" || key === "consent") state.wizard.data[key] = true;
      else state.wizard.data[key] = value;
    }
    state.wizard.data.docsReady = !!(form.elements.docsReady && form.elements.docsReady.checked);
    state.wizard.data.consent = !!(form.elements.consent && form.elements.consent.checked);
    if (state.wizard.type === "lapor") {
      state.wizard.data.rate = num(state.wizard.data.rate);
    }
  }

  function validateWizardStep() {
    const w = state.wizard;
    const form = $("#wizardForm");
    if (!w || !form) return true;
    let bad = false;
    if (w.type === "daftar") {
      if (w.step === 0) {
        bad = setFieldError(form, "nama", !w.data.nama || w.data.nama.trim().length < 2 ? "Isi nama lengkap." : "") || bad;
        bad = setFieldError(form, "nik", !w.data.nik || String(w.data.nik).replace(/\D/g, "").length < 8 ? "Isi nomor identitas minimal 8 digit." : "") || bad;
        bad = setFieldError(form, "phone", !w.data.phone || String(w.data.phone).replace(/\D/g, "").length < 8 ? "Isi nomor WhatsApp yang valid." : "") || bad;
        if (w.data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(w.data.email)) { setFieldError(form, "email", "Format email belum tepat."); bad = true; }
      }
      if (w.step === 1) {
        bad = setFieldError(form, "usaha", !w.data.usaha || w.data.usaha.trim().length < 2 ? "Isi nama usaha." : "") || bad;
        bad = setFieldError(form, "alamat", !w.data.alamat || w.data.alamat.trim().length < 5 ? "Isi alamat usaha." : "") || bad;
      }
      if (w.step === 2) {
        const error = form.querySelector("[data-docs-error]");
        if (!w.data.docsReady) { error.hidden = false; error.textContent = "Centang pernyataan kesiapan dokumen."; bad = true; } else error.hidden = true;
      }
      if (w.step === 3) {
        const error = form.querySelector("[data-consent-error]");
        if (!w.data.consent) { error.hidden = false; error.textContent = "Centang pernyataan sebelum mengirim."; bad = true; } else error.hidden = true;
      }
    } else {
      if (w.step === 0) {
        bad = setFieldError(form, "npwpd", !w.data.npwpd || w.data.npwpd.trim().length < 6 ? "Isi NPWPD atau gunakan contoh." : "") || bad;
      }
      if (w.step === 1) {
        bad = setFieldError(form, "base", num(w.data.base) <= 0 ? "Isi nilai dasar lebih dari nol." : "") || bad;
        bad = setFieldError(form, "rate", num(w.data.rate) <= 0 ? "Isi tarif lebih dari nol." : "") || bad;
      }
      if (w.step === 2) {
        bad = setFieldError(form, "name", !w.data.name || w.data.name.trim().length < 2 ? "Isi nama pelapor." : "") || bad;
        bad = setFieldError(form, "phone", !w.data.phone || String(w.data.phone).replace(/\D/g, "").length < 8 ? "Isi nomor WhatsApp." : "") || bad;
      }
    }
    if (bad) toast("error", "Periksa isian", "Lengkapi kolom yang ditandai.");
    return !bad;
  }

  function advanceWizard() {
    const w = state.wizard;
    if (!w) return;
    collectWizardData();
    if (!validateWizardStep()) return;
    const total = D.serviceFlows[w.type].steps.length;
    if (w.step < total - 1) {
      w.step += 1;
      renderWizard();
      return;
    }
    finalizeWizard();
  }

  function finalizeWizard() {
    const w = state.wizard;
    if (!w) return;
    collectWizardData();
    if (!validateWizardStep()) return;
    const btn = $("#wizardForm button[type=submit]");
    if (btn) { btn.disabled = true; btn.innerHTML = `${icon("loader-circle", "spin")} Memproses...`; }
    setTimeout(() => {
      const now = new Date();
      if (w.type === "daftar") {
        const code = `NPWPD-${now.getFullYear()}-${String(184 + state.registrations.length + Math.floor(Math.random() * 80)).padStart(4, "0")}`;
        const reg = { code, data: { ...w.data }, date: fmtDateTime(now), status: "Menunggu verifikasi", source: "public" };
        state.registrations.unshift(reg);
        LS.set("registrations", state.registrations);
        w.done = { kind: "daftar", code, reg };
        toast("success", "Permohonan dibuat", `${code} · ${w.data.usaha}`);
      } else {
        const amount = num(w.data.base) * num(w.data.rate) / 100;
        const code = `SPTPD-${now.getFullYear()}-${String(10300 + state.reports.length + Math.floor(Math.random() * 300))}`;
        const billing = `VA-${now.getFullYear()}-${String(700000 + Math.floor(Math.random() * 90000))}`;
        const tax = taxById(w.data.tax) || D.taxes[0];
        const report = {
          code, billing, tax: w.data.tax, taxName: tax.name, periodLabel: `${monthsShort[Number(w.data.periodMonth) - 1]} ${w.data.periodYear}`,
          base: num(w.data.base), rate: num(w.data.rate), amount, name: w.data.name, phone: w.data.phone, method: w.data.method,
          date: fmtDateTime(now), status: "Menunggu verifikasi"
        };
        state.reports.unshift(report);
        LS.set("reports", state.reports);
        w.done = { kind: "lapor", code, billing, report, tax };
        toast("success", "Ringkasan pelaporan dibuat", `${code} · ${rp(amount)}`);
      }
      renderWizardSuccess();
    }, 650);
  }

  function renderWizardSuccess() {
    const w = state.wizard;
    if (!w || !w.done) return;
    if (w.done.kind === "daftar") {
      const reg = w.done.reg;
      const summary = `PESONA — Ringkasan pendaftaran NPWPD\nKode: ${reg.code}\nNama: ${reg.data.nama}\nUsaha: ${reg.data.usaha}\nKegiatan: ${reg.data.jenisUsaha}\nWilayah: ${reg.data.wilayah}\nStatus: ${reg.status}\n\nPrototipe — bukan NPWPD resmi.`;
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Permohonan tercatat.</h2>
        <p>Nomor referensi dibuat. Pada prototipe, tidak ada data yang dikirim dan tidak ada NPWPD resmi yang diterbitkan.</p>
        <div class="success-code">${icon("id-card")} <span>${reg.code}</span></div>
        <div class="success-meta"><div><span>Usaha</span><strong>${escapeHTML(reg.data.usaha)}</strong></div><div><span>Wilayah</span><strong>${escapeHTML(reg.data.wilayah)}</strong></div><div><span>Estimasi verifikasi</span><strong>3 hari kerja</strong></div></div>
        <div class="success-actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${reg.code}">${icon("copy")} Salin kode</button>
          <button class="btn btn-secondary" type="button" data-download-name="ringkasan-npwpd.txt" data-download-text="${escapeHTML(summary)}">${icon("download")} Unduh ringkasan</button>
          <button class="btn btn-primary" type="button" data-check-code="${reg.code}">${icon("clipboard-check")} Cek status</button>
        </div>
      </div>`, { wide: true });
    } else {
      const r = w.done.report;
      const summary = `PESONA — Ringkasan pelaporan simulasi\nKode: ${r.code}\nKode billing: ${r.billing}\nJenis: ${r.taxName}\nMasa: ${r.periodLabel}\nNilai dasar: ${rp(r.base)}\nTarif: ${r.rate}%\nNominal: ${rp(r.amount)}\nMetode: ${r.method}\nStatus: ${r.status}\n\nTidak ada pembayaran nyata pada prototipe ini.`;
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Kode billing dibuat.</h2>
        <p>Ini simulasi. Jangan menggunakan kode di bawah untuk pembayaran sebenarnya.</p>
        <div class="success-code">${icon("file-text")} <span>${r.code}</span></div>
        <div class="success-meta"><div><span>Jenis</span><strong>${escapeHTML(r.taxName)}</strong></div><div><span>Masa</span><strong>${escapeHTML(r.periodLabel)}</strong></div><div><span>Nominal</span><strong>${rp(r.amount)}</strong></div></div>
        <div class="payment-box"><strong>Kode billing simulasi</strong><code>${r.billing}</code><p>Metode: ${escapeHTML(r.method)}. Gunakan kanal resmi saat melakukan pembayaran nyata.</p><div class="payment-options"><span>QRIS</span><span>Bank persepsi</span><span>Meja layanan</span></div></div>
        <div class="success-actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${r.billing}">${icon("copy")} Salin billing</button>
          <button class="btn btn-secondary" type="button" data-download-name="ringkasan-pelaporan.txt" data-download-text="${escapeHTML(summary)}">${icon("download")} Unduh ringkasan</button>
          <button class="btn btn-primary" type="button" data-check-code="${r.code}">${icon("clipboard-check")} Cek status</button>
        </div>
      </div>`, { wide: true });
    }
  }

  function wizardBack() {
    const w = state.wizard;
    if (!w) return;
    collectWizardData();
    if (w.step > 0) { w.step -= 1; renderWizard(); }
  }

  /* ============================================================
     AKUN
     ============================================================ */
  function renderAccount() {
    const root = $("#accountRoot");
    if (!root) return;
    if (!state.account) {
      root.innerHTML = `<div class="account-gate">
        <span class="empty-icon">${icon("lock")}</span>
        <h2>Masuk untuk melihat akun demo.</h2>
        <p>Ruang ini memperlihatkan contoh kewajiban, riwayat pembayaran, dokumen, dan progres belajar. Tidak perlu kata sandi.</p>
        <button class="btn btn-primary" type="button" data-login-open>${icon("user-round")} Masuk sebagai wajib pajak</button>
        <button class="btn btn-secondary" type="button" data-login-role="petugas">${icon("layout-dashboard")} Buka portal petugas</button>
        <p class="micro" style="margin-top:16px">Data akun pada prototipe ini fiktif.</p>
      </div>`;
      return;
    }
    const u = D.demoUser;
    const done = completionCount();
    const pct = Math.round((done / state.articles.length) * 100);
    const cert = certificateState();
    root.innerHTML = `<div class="account-hero">
      <span class="account-avatar">${u.initials}</span>
      <div class="account-hero-main"><h2>${escapeHTML(u.name)}</h2><span class="npwpd">${escapeHTML(u.npwpd)}</span><span class="badge" style="margin-top:7px">${escapeHTML(u.status)} · akun demo</span></div>
      <div class="account-hero-actions"><a class="btn btn-secondary" href="#/usaha">${icon("store")} Ruang usaha</a><button class="btn btn-secondary" type="button" data-open-service="lapor">${icon("receipt-text")} Lapor &amp; bayar</button><button class="btn btn-secondary" type="button" data-account-logout>${icon("log-out")} Keluar demo</button></div>
    </div>
    <div class="account-grid">
      <div style="display:grid;gap:12px">
        <div class="account-card">
          <div class="account-card-head"><div><h3>Kewajiban saya</h3><p>Contoh tagihan dan status pelaporan.</p></div><span class="badge badge-sun">2 item</span></div>
          <div class="obligation-list">${u.obligations.map((o) => `<div class="obligation">
            <div class="obligation-main"><strong>${escapeHTML(o.tax)} · ${escapeHTML(o.period)}</strong><span>Jatuh tempo ${escapeHTML(o.due)} · ${escapeHTML(o.id)}</span></div>
            <div class="obligation-right"><span class="obligation-amount">${rp(o.amount)}</span><span class="status-chip ${o.status === "Lunas" ? "ok" : "warn"}">${escapeHTML(o.status)}</span>${o.status === "Lunas" ? `<button class="btn btn-secondary" type="button" data-copy-text="Bukti ${escapeHTML(o.id)} — ${escapeHTML(o.period)} — ${rp(o.amount)}">${icon("eye")} Bukti</button>` : `<button class="btn btn-primary" type="button" data-open-service="lapor">${icon("credit-card")} Bayar</button>`}</div>
          </div>`).join("")}</div>
          <p class="micro" style="margin-top:10px">Nominal dan status adalah data contoh. Pembayaran tidak diproses.</p>
        </div>
        <div class="account-card">
          <div class="account-card-head"><div><h3>Ruang usaha</h3><p>Registry Citta Karya untuk usaha Anda.</p></div><span class="badge badge-ok">${escapeHTML(u.listing.status)}</span></div>
          <div class="profile-list">
            <div><span>Listing</span><strong>${escapeHTML(u.business)}</strong></div>
            <div><span>NIB</span><strong>${escapeHTML(u.nib)}</strong></div>
            <div><span>Level verifikasi</span><strong>${escapeHTML(providerLevel(u.listing.level).label)} · sejak ${escapeHTML(u.listing.since)}</strong></div>
            <div><span>Kinerja</span><strong>${u.listing.bookings} booking · rating ${String(u.listing.rating).replace(".", ",")}</strong></div>
          </div>
          <div class="tax-chips" style="margin-top:12px">${u.certifications.map((c) => `<span>${escapeHTML(c)}</span>`).join("")}</div>
          <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:13px"><a class="btn btn-secondary btn-sm" href="#/usaha">${icon("store")} Buka registry</a><button class="btn btn-ghost btn-sm" type="button" data-toast-info="Pengelolaan listing belum tersedia pada prototipe. Gunakan alur pendaftaran penyedia untuk mencoba.">${icon("pen-line")} Kelola listing</button></div>
        </div>
        <div class="account-card">
          <div class="account-card-head"><div><h3>Riwayat pembayaran</h3><p>Tiga transaksi terakhir pada akun demo.</p></div><button class="text-btn" type="button" data-copy-text="Riwayat pembayaran demo PESONA">Salin ringkasan</button></div>
          <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Tanggal</th><th>Jenis</th><th>Masa</th><th class="num">Nominal</th><th>Status</th></tr></thead><tbody>${u.history.map((h) => `<tr><td>${escapeHTML(h.date)}</td><td>${escapeHTML(h.tax)}</td><td>${escapeHTML(h.period)}</td><td class="num">${rp(h.amount)}</td><td><span class="status-chip ok">${escapeHTML(h.status)}</span></td></tr>`).join("")}</tbody></table></div>
        </div>
      </div>
      <div class="account-side">
        <div class="account-card">
          <div class="account-card-head"><div><h3>Profil usaha</h3></div></div>
          <div class="profile-list">
            <div><span>Nama usaha</span><strong>${escapeHTML(u.business)}</strong></div>
            <div><span>Jenis</span><strong>${escapeHTML(u.type)}</strong></div>
            <div><span>Alamat</span><strong>${escapeHTML(u.address)}</strong></div>
            <div><span>Terdaftar</span><strong>${escapeHTML(u.since)}</strong></div>
          </div>
        </div>
        <div class="account-card">
          <div class="account-card-head"><div><h3>Dokumen</h3></div><span class="badge badge-muted">3 file</span></div>
          <div class="doc-list">${u.documents.map((d) => `<div class="doc-item"><span class="doc-item-icon">${icon(d.icon)}</span><div><strong>${escapeHTML(d.name)}</strong><span>${escapeHTML(d.meta)}</span></div></div>`).join("")}</div>
          <button class="btn btn-secondary btn-block" type="button" style="margin-top:10px" data-toast-info="Dokumen contoh tidak dapat diunduh pada prototipe.">${icon("download")} Unduh dokumen</button>
        </div>
        <div class="account-card">
          <div class="account-card-head"><div><h3>Progres belajar</h3></div><span class="badge ${cert.eligible ? "badge-ok" : "badge-muted"}">${cert.eligible ? "Sertifikat siap" : "Citta Vidya"}</span></div>
          <div class="account-progress"><div class="progress-ring" style="--pct:${pct}"><span>${pct}%</span></div><div><strong>${done} dari ${state.articles.length} materi</strong><span>${done === 0 ? "Mulai dari jalur dasar." : done === state.articles.length ? "Semua materi selesai." : "Lanjutkan jalur belajar Anda."}</span></div></div>
          <div class="training-meta" style="margin-top:12px"><span>${icon("circle-help")} Skor kuis ${cert.best}%</span><span>${icon("book-open-check")} ${u.trainingDone}/${u.trainingTotal} pelatihan</span></div>
          <button class="btn ${cert.eligible ? "btn-primary" : "btn-secondary"} btn-block" type="button" style="margin-top:12px" data-open-certificate>${icon("badge-check")} ${cert.eligible ? "Buka sertifikat" : "Lihat syarat sertifikat"}</button>
          <a class="btn btn-secondary btn-block" href="#/edukasi" style="margin-top:7px">${icon("book-open")} Buka pusat edukasi</a>
        </div>
        <div class="account-note">${icon("info")} Akun ini adalah simulasi. Nama, NPWPD, tagihan, dan riwayat tidak merujuk pada orang atau usaha nyata.</div>
      </div>
    </div>`;
    initReveals(root);
  }


  /* ============================================================
     CITTA KARYA — REGISTRY, BOOKING, PELATIHAN, KOPERASI
     ============================================================ */
  const providerTone = { homestay: "mint", guide: "forest", dive: "forest", kuliner: "peach", boat: "sand" };
  const providerIcon = { homestay: "house", guide: "map-pin", dive: "waves", kuliner: "utensils", boat: "car-front" };

  function providerCategoryLabel(id) {
    const category = KARYA.categories.find((c) => c.id === id);
    return category ? category.label : id;
  }

  function providerLevel(level) {
    return KARYA.verificationLevels[level] || KARYA.verificationLevels[1];
  }

  function providerStatus(p) {
    return state.providerOverrides[p.id] || p.status || "Terverifikasi";
  }

  function getDirectoryProviders() {
    const local = state.providers.filter((p) => p.status === "Terverifikasi");
    const demo = KARYA.providerQueue
      .filter((p) => providerStatus(p) === "Terverifikasi")
      .map((p) => ({ ...p, status: "Terverifikasi", verified: "Terverifikasi" }));
    return [...local, ...demo, ...KARYA.providers.filter((p) => p.status === "Terverifikasi")];
  }

  function getProviderApplications() {
    const demo = KARYA.providerQueue.map((p) => ({ ...p, status: providerStatus(p) }));
    return [...state.providers, ...demo].filter((p) => p.status !== "Terverifikasi");
  }

  function allProviderRecords() {
    const demo = KARYA.providerQueue.map((p) => ({ ...p, status: providerStatus(p) }));
    return [...state.providers, ...demo, ...KARYA.providers];
  }

  function providerCardHTML(p) {
    const level = providerLevel(p.level);
    const licenses = (p.licenses || []).slice(0, 3);
    const tone = p.tone || providerTone[p.category] || "forest";
    return `<article class="provider-card">
      <div class="provider-cover tone-${tone}">
        <span class="provider-cover-icon">${icon(providerIcon[p.category] || "store")}</span>
        <span class="provider-cover-cat">${escapeHTML(p.categoryLabel || providerCategoryLabel(p.category))}</span>
      </div>
      <div class="provider-body">
        <div class="provider-top"><h3>${escapeHTML(p.name)}</h3><span class="verify-pill lvl-${p.level || 1}">${icon("badge-check")} ${escapeHTML(level.label)}</span></div>
        <span class="provider-loc">${icon("map-pin")} ${escapeHTML(p.area)}</span>
        <p class="provider-desc">${escapeHTML(p.desc)}</p>
        <div class="provider-chips">${licenses.map((l) => `<span>${escapeHTML(l)}</span>`).join("")}${(p.certifications || []).slice(0, 1).map((c) => `<span>${escapeHTML(c)}</span>`).join("")}</div>
        <div class="provider-foot">
          <div><div class="provider-price">${rp(p.price)}<small>/${escapeHTML(p.unit)}</small></div><span class="micro">${p.rating ? `${String(p.rating).replace(".", ",")} · ${fmtNum(p.reviews)} ulasan` : "Penyedia baru"}</span></div>
          <div class="provider-actions"><button class="btn btn-secondary" type="button" data-provider-open="${escapeHTML(p.id)}">Detail</button><button class="btn btn-primary" type="button" data-book-provider="${escapeHTML(p.id)}">Pesan</button></div>
        </div>
      </div>
    </article>`;
  }

  function renderUsahaStats() {
    const wrap = $("#usahaStats");
    if (!wrap) return;
    const items = [
      { label: "Penyedia terverifikasi", value: fmtNum(KARYA.stats.providers), sub: "NIB & NPWPD diperiksa", icon: "store" },
      { label: "Koperasi / KDKMP", value: fmtNum(KARYA.stats.cooperatives), sub: "operator usaha warga", icon: "users" },
      { label: "Booking bulan ini", value: fmtNum(KARYA.stats.bookings), sub: "transaksi tercatat", icon: "calendar-check-2" },
      { label: "PAD tervalidasi", value: "Rp" + Number(KARYA.stats.validatedPad).toFixed(1).replace(".", ",") + " M", sub: "dari kanal PESONA", icon: "trending-up" }
    ];
    wrap.innerHTML = items.map((s) => `<div class="usaha-stat"><span>${escapeHTML(s.label)}</span><strong>${escapeHTML(s.value)}</strong><small>${icon(s.icon)} ${escapeHTML(s.sub)}</small></div>`).join("");
  }

  function renderProviderFilters() {
    const wrap = $("#providerFilters");
    const select = $("#providerArea");
    if (wrap) {
      wrap.innerHTML = KARYA.categories.map((c) => `<button class="chip ${state.providerFilter === c.id ? "active" : ""}" type="button" data-provider-filter="${c.id}">${escapeHTML(c.label)}</button>`).join("");
    }
    if (select) {
      const areas = Array.from(new Set([...D.regions, ...allProviderRecords().map((p) => p.area)]));
      select.innerHTML = `<option value="all">Semua wilayah</option>${areas.map((a) => `<option value="${escapeHTML(a)}" ${state.providerArea === a ? "selected" : ""}>${escapeHTML(a)}</option>`).join("")}`;
    }
  }

  function filteredProviders() {
    const q = state.providerSearch.trim().toLowerCase();
    return getDirectoryProviders().filter((p) => {
      if (state.providerFilter !== "all" && p.category !== state.providerFilter) return false;
      if (state.providerArea !== "all" && p.area !== state.providerArea) return false;
      if (q) {
        const hay = [p.name, p.categoryLabel, p.area, p.desc, ...(p.certifications || []), ...(p.licenses || [])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function renderProviderGrid() {
    const grid = $("#providerGrid");
    const empty = $("#providerEmpty");
    if (!grid) return;
    const list = filteredProviders();
    grid.innerHTML = list.map(providerCardHTML).join("");
    if (empty) empty.hidden = list.length > 0;
  }

  function renderHomeProviders() {
    const grid = $("#homeProviders");
    if (!grid) return;
    const featured = KARYA.providers.filter((p) => p.featured).slice(0, 3);
    grid.innerHTML = (featured.length ? featured : KARYA.providers.slice(0, 3)).map(providerCardHTML).join("");
  }

  function renderTrainings() {
    const grid = $("#trainingGrid");
    if (!grid) return;
    grid.innerHTML = KARYA.trainings.map((t) => {
      const pay = Math.round(t.price * (1 - (t.subsidy || 0)));
      return `<article class="training-card">
        <div class="training-top"><span class="training-icon tone-${t.tone || "forest"}">${icon(t.cat === "Pajak" ? "receipt-text" : t.cat === "Digital" ? "chart-column" : t.cat === "Kuliner" ? "utensils" : t.cat === "Dive" ? "waves" : "book-open-check")}</span><span class="badge ${t.certified ? "badge-ok" : "badge-muted"}">${t.certified ? "Ada sertifikasi" : "Pelatihan"}</span></div>
        <h3>${escapeHTML(t.title)}</h3>
        <p>${escapeHTML(t.desc)}</p>
        <div class="training-meta"><span>${icon("clock")} ${escapeHTML(t.duration)}</span><span>${icon("map-pin")} ${escapeHTML(t.mode)}</span><span>${icon("users")} ${escapeHTML(t.provider)}</span></div>
        <div class="training-foot">
          <div class="training-price">${rp(pay)}<small>setelah subsidi contoh · kuota ${t.quota}</small></div>
          <button class="btn btn-secondary" type="button" data-training-register="${escapeHTML(t.id)}">Daftar</button>
        </div>
      </article>`;
    }).join("");
  }

  function renderPartners() {
    const grid = $("#partnerGrid");
    if (!grid) return;
    grid.innerHTML = KARYA.partners.map((p) => `<div class="partner-card"><span class="partner-logo tone-${p.tone}">${icon(p.icon)}</span><span><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(p.role)}</span></span></div>`).join("");
  }

  function renderCooperative() {
    const coop = KARYA.cooperative;
    const name = $("#koperasiName");
    const area = $("#koperasiArea");
    const report = $("#koperasiReport");
    if (name) name.textContent = coop.name;
    if (area) area.textContent = coop.area;
    if (report) report.innerHTML = coop.report.map((r) => `<div><span>${escapeHTML(r.label)}</span><strong>${escapeHTML(r.value)}</strong></div>`).join("");
    const input = $("#shareValue");
    if (input && !input.value) input.value = "5.000.000";
    updateShareResult();
  }

  function updateShareResult() {
    const out = $("#shareResult");
    const input = $("#shareValue");
    if (!out || !input) return;
    const value = num(input.value);
    const colors = ["#8fceb4", "#e39b3b", "#d97b5f"];
    out.innerHTML = KARYA.cooperative.split.map((s, i) => `<div class="share-row"><i style="background:${colors[i]}"></i><span>${escapeHTML(s.label)} (${s.pct}%)</span><strong>${rp(value * s.pct / 100)}</strong></div>`).join("") + `<div class="share-bar">${KARYA.cooperative.split.map((s, i) => `<span style="width:${s.pct}%;background:${colors[i]}"></span>`).join("")}</div>`;
  }

  function openKoperasiReport() {
    const coop = KARYA.cooperative;
    const total = coop.monthlyValue;
    const colors = ["#2e6b5b", "#e39b3b", "#d97b5f"];
    openDialog(`<div class="dialog-pad dialog-pad-top">
      <span class="badge badge-sun">Ruang koperasi · laporan simulasi</span>
      <h2 id="dialogTitle" style="margin-top:11px">${escapeHTML(coop.name)}</h2>
      <p style="margin-top:5px;font-size:.8rem;color:var(--muted)">${escapeHTML(coop.area)} · laporan bulanan contoh</p>
      <div class="coop-snapshot" style="margin-top:16px">${coop.report.map((r) => `<div><span>${escapeHTML(r.label)}</span><strong>${escapeHTML(r.value)}</strong></div>`).join("")}</div>
      <h3 style="margin-top:18px;font-size:1.05rem">Bagi hasil ${rp(total)}</h3>
      <div class="booking-lines">${coop.split.map((s, i) => `<div class="booking-line"><span><i style="display:inline-block;width:7px;height:7px;border-radius:2px;background:${colors[i]};margin-right:6px"></i>${escapeHTML(s.label)} (${s.pct}%)</span><strong>${rp(total * s.pct / 100)}</strong></div>`).join("")}</div>
      <h3 style="margin-top:18px;font-size:1.05rem">Katalog anggota contoh</h3>
      <div class="booking-lines">
        <div class="booking-line"><span>Nusa Asri Homestay</span><strong>4 kamar</strong></div>
        <div class="booking-line"><span>Kadek Penida Guide</span><strong>6 peserta</strong></div>
        <div class="booking-line"><span>Kafe Sunrise Penida</span><strong>32 kursi</strong></div>
      </div>
      <div class="note" style="margin-top:16px;padding:12px 14px;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 9px 9px 0;font-size:10px;line-height:1.55">Laporan ini adalah simulasi prototipe. Skema bagi hasil resmi harus disepakati anggota koperasi dan dicatat dalam laporan keuangan.</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:18px"><button class="btn btn-primary" type="button" data-toast-info="Unduhan laporan belum tersedia pada prototipe.">${icon("download")} Unduh laporan</button><button class="btn btn-secondary" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya koperasi</button></div>
    </div>`, { wide: true });
  }

  function renderUsaha() {
    renderUsahaStats();
    renderProviderFilters();
    renderProviderGrid();
    renderTrainings();
    renderPartners();
    renderCooperative();
    initReveals($("#view-usaha"));
  }

  function openProviderProfile(id) {
    const p = getDirectoryProviders().find((x) => x.id === id);
    if (!p) { toast("info", "Penyedia belum tersedia", "Penyedia ini belum lolos verifikasi atau tidak ditemukan."); return; }
    const level = providerLevel(p.level);
    openDialog(`<div class="dialog-pad dialog-pad-top">
      <span class="badge badge-sun">${escapeHTML(p.categoryLabel || providerCategoryLabel(p.category))} · ${escapeHTML(p.area)}</span>
      <h2 id="dialogTitle" style="margin-top:11px;font-size:clamp(1.7rem,3vw,2.2rem)">${escapeHTML(p.name)}</h2>
      <p style="margin-top:6px;font-size:.8rem;color:var(--muted)">${icon("badge-check")} ${escapeHTML(level.label)} · ${p.rating ? `${String(p.rating).replace(".", ",")} dari ${fmtNum(p.reviews)} ulasan` : "Penyedia baru"}</p>
      <div class="booking-provider" style="margin-top:17px"><span class="provider-cover-icon tone-${p.tone || providerTone[p.category] || "forest"}">${icon(providerIcon[p.category] || "store")}</span><span><strong>${rp(p.price)} / ${escapeHTML(p.unit)}</strong><span>${escapeHTML(p.capacity)} · terdaftar sejak ${escapeHTML(p.since)}</span></span></div>
      <div class="article-body" style="padding:0;margin-top:17px">
        <p>${escapeHTML(p.desc)}</p>
        <h3>Verifikasi dan legalitas</h3>
        <div class="tax-chips">${(p.licenses || []).map((l) => `<span>${escapeHTML(l)}</span>`).join("")}</div>
        <h3>Sertifikasi</h3>
        <div class="tax-chips">${(p.certifications || []).length ? p.certifications.map((c) => `<span>${escapeHTML(c)}</span>`).join("") : "<span>Belum ada sertifikasi</span>"}</div>
        <div class="note" style="margin-top:18px">${escapeHTML(level.desc)} Status ini adalah simulasi registry PESONA. PESONA bukan penerbit izin dan tidak memungut pembayaran.</div>
      </div>
      <div class="tax-modal-foot">
        <p class="micro">Kontak dan transaksi dikelola melalui kanal PESONA.</p>
        <div class="actions">
          <button class="btn btn-secondary" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya</button>
          <button class="btn btn-primary" type="button" data-book-provider="${escapeHTML(p.id)}">${icon("calendar-check-2")} Pesan sekarang</button>
        </div>
      </div>
    </div>`, { wide: true });
  }

  function openBooking(id) {
    const p = getDirectoryProviders().find((x) => x.id === id);
    if (!p) { toast("info", "Penyedia belum tersedia", "Pilih penyedia yang sudah terverifikasi."); return; }
    state.bookingProvider = p;
    const next = isoLocal(addDays(new Date(), 3));
    openDialog(`<div class="wizard-head">
        <span class="mini-label">Booking simulasi · ${escapeHTML(p.categoryLabel || providerCategoryLabel(p.category))}</span>
        <h2 id="dialogTitle">Pesan ${escapeHTML(p.name)}</h2>
        <p>Isi tanggal dan jumlah. Tidak ada pembayaran nyata pada prototipe ini.</p>
        <div class="wizard-steps"><span class="wizard-step-dot active"><i>1</i><span>Detail</span></span><span class="wizard-step-dot"><i>2</i><span>Ringkasan</span></span><span class="wizard-step-dot"><i>3</i><span>Kode booking</span></span></div>
      </div>
      <form id="bookingForm" novalidate>
        <div class="wizard-body">
          <div class="booking-provider"><span class="provider-cover-icon tone-${p.tone || providerTone[p.category] || "forest"}">${icon(providerIcon[p.category] || "store")}</span><span><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(p.area)} · ${rp(p.price)} / ${escapeHTML(p.unit)}</span></span></div>
          <div class="form-grid">
            <div class="form-field"><label for="bookName">Nama pemesan</label><input class="input" id="bookName" name="name" autocomplete="name" value="${escapeHTML(state.account ? D.demoUser.name : "")}" autofocus><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="bookContact">WhatsApp atau email</label><input class="input" id="bookContact" name="contact" placeholder="0812... atau nama@email.com"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="bookDate">Tanggal</label><input class="input" id="bookDate" name="date" type="date" min="${todayISO()}" value="${next}"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="bookQty">Jumlah ${escapeHTML(p.unit)}</label><input class="input" id="bookQty" name="qty" type="number" min="1" max="20" value="1" inputmode="numeric"><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="bookNotes">Catatan <span style="color:var(--muted);font-weight:400">(opsional)</span></label><textarea class="input" id="bookNotes" name="notes" rows="2" placeholder="Kebutuhan khusus, jam kedatangan, atau jumlah peserta."></textarea></div>
          </div>
          <div id="bookingSummary"></div>
          <p class="micro" style="margin-top:10px">PBJT 10% dan bagi hasil koperasi pada ringkasan adalah ilustrasi.</p>
        </div>
        <div class="wizard-foot"><span class="micro">Kode booking dibuat otomatis</span><button class="btn btn-primary" type="submit">Buat booking ${icon("arrow-right")}</button></div>
      </form>`);
    updateBookingSummary();
  }

  function updateBookingSummary() {
    const p = state.bookingProvider;
    const box = $("#bookingSummary");
    if (!p || !box) return;
    const qty = Math.max(1, num($("#bookQty") ? $("#bookQty").value : 1));
    const subtotal = p.price * qty;
    const tax = Math.round(subtotal * 0.1);
    box.innerHTML = `<div class="booking-lines">
      <div class="booking-line"><span>${rp(p.price)} × ${qty} ${escapeHTML(p.unit)}</span><strong>${rp(subtotal)}</strong></div>
      <div class="booking-line"><span>PBJT ilustrasi 10%</span><strong>${rp(tax)}</strong></div>
      <div class="booking-line total"><span>Total simulasi</span><strong>${rp(subtotal + tax)}</strong></div>
    </div>
    <div class="booking-split" aria-hidden="true"><span style="width:80%;background:#2e6b5b"></span><span style="width:10%;background:#e39b3b"></span><span style="width:10%;background:#d97b5f"></span></div>
    <p class="micro">Bagi hasil ilustrasi: 80% operator, 10% kas koperasi, 10% dana komunitas.</p>`;
  }

  function submitBooking(form) {
    const p = state.bookingProvider;
    if (!p) return;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const dateValue = String(fd.get("date") || "");
    const qty = Math.max(1, num(fd.get("qty")));
    let bad = false;
    bad = setFieldError(form, "name", name.length < 2 ? "Isi nama pemesan." : "") || bad;
    bad = setFieldError(form, "contact", contact.length < 5 ? "Isi kontak yang bisa dihubungi." : "") || bad;
    bad = setFieldError(form, "date", !dateValue ? "Pilih tanggal." : "") || bad;
    if (bad) { toast("error", "Periksa formulir", "Lengkapi nama, kontak, dan tanggal."); return; }
    const subtotal = p.price * qty;
    const tax = Math.round(subtotal * 0.1);
    const now = new Date();
    const code = `BKG-${now.getFullYear().toString().slice(-2)}${pad(now.getMonth() + 1)}-${String(1043 + state.bookings.length + Math.floor(Math.random() * 800))}`;
    const booking = {
      code, providerId: p.id, provider: p.name, date: fmtDate(new Date(dateValue + "T00:00:00")), qty, unit: p.unit,
      subtotal, tax, total: subtotal + tax, status: "Terkonfirmasi", channel: "QRIS (simulasi)",
      name, contact, notes: String(fd.get("notes") || "").trim(), created: fmtDateTime(now)
    };
    state.bookings.unshift(booking);
    saveDynamic();
    closeDialog();
    setTimeout(() => {
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Booking tercatat.</h2>
        <p>Simulasi berhasil. Tidak ada pembayaran nyata dan tidak ada pesanan yang dikirim ke penyedia.</p>
        <div class="success-code">${icon("ticket")} <span>${escapeHTML(booking.code)}</span></div>
        <div class="success-meta"><div><span>Penyedia</span><strong>${escapeHTML(booking.provider)}</strong></div><div><span>Tanggal</span><strong>${escapeHTML(booking.date)}</strong></div><div><span>Total</span><strong>${rp(booking.total)}</strong></div></div>
        <div class="payment-box"><strong>Pembayaran QRIS simulasi</strong><div class="qr-demo">${icon("qr-code")}<span>QR contoh · bukan kanal pembayaran</span></div><p>PBJT ${rp(booking.tax)} dihitung dalam ringkasan. Pada implementasi nyata, pajak disetor ke kas daerah melalui kanal resmi.</p></div>
        <div class="booking-lines"><div class="booking-line"><span>Subtotal</span><strong>${rp(booking.subtotal)}</strong></div><div class="booking-line"><span>PBJT ilustrasi 10%</span><strong>${rp(booking.tax)}</strong></div><div class="booking-line"><span>Operator (80%)</span><strong>${rp(Math.round(booking.subtotal * .8))}</strong></div><div class="booking-line"><span>Kas koperasi (10%)</span><strong>${rp(Math.round(booking.subtotal * .1))}</strong></div><div class="booking-line"><span>Dana komunitas (10%)</span><strong>${rp(Math.round(booking.subtotal * .1))}</strong></div></div>
        <div class="success-actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${escapeHTML(booking.code)}">${icon("copy")} Salin kode</button>
          <button class="btn btn-secondary" type="button" data-download-name="ringkasan-booking.txt" data-download-text="${escapeHTML(bookingText(booking))}">${icon("download")} Unduh ringkasan</button>
          <button class="btn btn-primary" type="button" data-check-code="${escapeHTML(booking.code)}">${icon("clipboard-check")} Cek status</button>
        </div>
      </div>`, { wide: true });
      toast("success", "Booking dibuat", `${booking.code} · ${booking.provider}`);
      if (state.currentView === "usaha") renderUsaha();
    }, 140);
  }

  function bookingText(b) {
    return `PESONA — Ringkasan booking simulasi\nKode: ${b.code}\nPenyedia: ${b.provider}\nTanggal: ${b.date}\nJumlah: ${b.qty}\nSubtotal: ${rp(b.subtotal)}\nPBJT ilustrasi: ${rp(b.tax)}\nTotal: ${rp(b.total)}\nStatus: ${b.status}\n\nTidak ada pembayaran nyata. Prototipe PESONA.`;
  }

  function openProviderForm() {
    openDialog(`<div class="wizard-head">
        <span class="mini-label">Citta Karya · pendaftaran penyedia</span>
        <h2 id="dialogTitle">Daftarkan usaha Anda.</h2>
        <p>Isi profil dan dokumen dasar. Pengajuan akan masuk antrean verifikasi petugas.</p>
        <div class="wizard-steps"><span class="wizard-step-dot active"><i>1</i><span>Profil</span></span><span class="wizard-step-dot"><i>2</i><span>Dokumen</span></span><span class="wizard-step-dot"><i>3</i><span>Verifikasi</span></span></div>
      </div>
      <form id="providerForm" novalidate>
        <div class="wizard-body">
          <div class="form-grid">
            <div class="form-field"><label for="pvName">Nama usaha</label><input class="input" id="pvName" name="name" value="${escapeHTML(state.account ? D.demoUser.business : "")}" autofocus><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="pvCategory">Kategori</label><select class="select" id="pvCategory" name="category">${KARYA.categories.filter((c) => c.id !== "all").map((c) => `<option value="${c.id}">${escapeHTML(c.label)}</option>`).join("")}</select></div>
            <div class="form-field"><label for="pvArea">Wilayah</label><select class="select" id="pvArea" name="area">${D.regions.map((r) => `<option>${escapeHTML(r)}</option>`).join("")}</select></div>
            <div class="form-field"><label for="pvCapacity">Kapasitas</label><input class="input" id="pvCapacity" name="capacity" placeholder="Contoh: 4 kamar atau 6 peserta"></div>
            <div class="form-field"><label for="pvPrice">Harga mulai</label><div class="input-money-wrap"><span>Rp</span><input class="input" id="pvPrice" name="price" data-money inputmode="numeric" value="100.000" autocomplete="off"></div><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="pvContact">WhatsApp</label><input class="input" id="pvContact" name="contact" inputmode="tel" placeholder="0812..."><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="pvNib">NIB</label><input class="input" id="pvNib" name="nib" placeholder="NIB-..."><span class="hint">Contoh nomor saja. Jangan gunakan dokumen asli pada prototipe.</span><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="pvNpwpd">NPWPD</label><input class="input" id="pvNpwpd" name="npwpd" placeholder="NPWPD-..."><span class="hint">Diperlukan sebelum listing aktif.</span><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="pvDesc">Deskripsi usaha</label><textarea class="input" id="pvDesc" name="desc" rows="3" placeholder="Ceritakan layanan, keunikan, dan pengalaman yang ditawarkan."></textarea><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><span class="hint">Kelengkapan dokumen (simulasi)</span>
              <div class="check-list">
                <label class="check-item"><input type="checkbox" name="docNib" checked><span class="check-box">${icon("check")}</span><span><strong>NIB / izin usaha</strong><small>Dokumen dasar kegiatan.</small></span></label>
                <label class="check-item"><input type="checkbox" name="docNpwpd"><span class="check-box">${icon("check")}</span><span><strong>NPWPD</strong><small>Identitas wajib pajak daerah.</small></span></label>
                <label class="check-item"><input type="checkbox" name="docCert"><span class="check-box">${icon("check")}</span><span><strong>Sertifikasi / pelatihan</strong><small>Bila sudah tersedia.</small></span></label>
                <label class="check-item"><input type="checkbox" name="docPhoto"><span class="check-box">${icon("check")}</span><span><strong>Foto lokasi</strong><small>Bukti kegiatan usaha.</small></span></label>
                <label class="check-item"><input type="checkbox" name="docCommit"><span class="check-box">${icon("check")}</span><span><strong>Komitmen layanan</strong><small>Harga transparan dan keluhan 3×24 jam.</small></span></label>
              </div>
            </div>
          </div>
          <label class="consent-row"><input type="checkbox" name="consent"> <span>Saya memahami pengajuan ini adalah simulasi dan tidak menerbitkan izin resmi.</span></label>
          <span class="field-error" data-provider-consent hidden></span>
        </div>
        <div class="wizard-foot"><span class="micro">Verifikasi contoh: 3 hari kerja</span><button class="btn btn-primary" type="submit">Kirim pengajuan ${icon("send")}</button></div>
      </form>`, { wide: true });
  }

  function submitProvider(form) {
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const nib = String(fd.get("nib") || "").trim();
    const npwpd = String(fd.get("npwpd") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const desc = String(fd.get("desc") || "").trim();
    const consent = !!fd.get("consent");
    let bad = false;
    bad = setFieldError(form, "name", name.length < 2 ? "Isi nama usaha." : "") || bad;
    bad = setFieldError(form, "nib", nib.length < 5 ? "Isi nomor NIB contoh." : "") || bad;
    bad = setFieldError(form, "npwpd", npwpd.length < 5 ? "Isi NPWPD contoh." : "") || bad;
    bad = setFieldError(form, "contact", String(contact).replace(/\D/g, "").length < 8 ? "Isi nomor WhatsApp." : "") || bad;
    const consentErr = form.querySelector("[data-provider-consent]");
    if (!consent) { consentErr.hidden = false; consentErr.textContent = "Centang pernyataan sebelum mengirim."; bad = true; } else consentErr.hidden = true;
    if (bad) { toast("error", "Periksa pengajuan", "Lengkapi profil dan dokumen dasar."); return; }
    const checks = ["docNib", "docNpwpd", "docCert", "docPhoto", "docCommit"].filter((key) => !!fd.get(key));
    const now = new Date();
    const category = String(fd.get("category") || "kuliner");
    const code = `PVD-${now.getFullYear()}-${String(42 + state.providers.length).padStart(4, "0")}`;
    const application = {
      id: "local-" + now.getTime(), code, name, category, categoryLabel: providerCategoryLabel(category),
      area: String(fd.get("area") || "Klungkung"), price: num(fd.get("price")) || 100000,
      unit: category === "homestay" ? "malam" : category === "guide" ? "trip" : category === "dive" ? "dive" : "pax",
      rating: 0, reviews: 0, level: 1, status: "Dalam verifikasi", licenses: [nib ? "NIB" : "", npwpd ? "NPWPD" : ""].filter(Boolean),
      certifications: fd.get("docCert") ? ["Sertifikat (klaim)"] : [], desc: desc || "Profil usaha baru pada prototipe PESONA.",
      capacity: String(fd.get("capacity") || "Belum diisi"), since: String(now.getFullYear()), contact,
      submitted: fmtDateTime(now), docs: `${checks.length}/5`, tone: providerTone[category] || "forest", npwpd
    };
    state.providers.unshift(application);
    saveDynamic();
    updateProviderCount();
    closeDialog();
    setTimeout(() => {
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Pengajuan tercatat.</h2>
        <p>Usaha akan tampil di registry setelah verifikasi. Pada prototipe ini tidak ada dokumen yang dikirim ke OPD.</p>
        <div class="success-code">${icon("store")} <span>${escapeHTML(code)}</span></div>
        <div class="success-meta"><div><span>Usaha</span><strong>${escapeHTML(name)}</strong></div><div><span>Kategori</span><strong>${escapeHTML(application.categoryLabel)}</strong></div><div><span>Dokumen</span><strong>${escapeHTML(application.docs)}</strong></div></div>
        <div class="success-actions">
          <button class="btn btn-secondary" type="button" data-copy-text="${escapeHTML(code)}">${icon("copy")} Salin kode</button>
          <button class="btn btn-primary" type="button" data-check-code="${escapeHTML(code)}">${icon("clipboard-check")} Cek status</button>
        </div>
      </div>`);
      toast("success", "Pengajuan penyedia dibuat", `${code} · ${name}`);
      if (state.currentView === "usaha") renderUsaha();
    }, 140);
  }

  function openTrainingRegister(id) {
    const t = KARYA.trainings.find((x) => x.id === id);
    if (!t) return;
    const pay = Math.round(t.price * (1 - (t.subsidy || 0)));
    openDialog(`<div class="wizard-head">
        <span class="mini-label">Pelatihan &amp; sertifikasi · ${escapeHTML(t.cat)}</span>
        <h2 id="dialogTitle">${escapeHTML(t.title)}</h2>
        <p>${escapeHTML(t.desc)}</p>
      </div>
      <form id="trainingForm" novalidate>
        <div class="wizard-body">
          <div class="booking-lines">
            <div class="booking-line"><span>Penyelenggara</span><strong>${escapeHTML(t.provider)}</strong></div>
            <div class="booking-line"><span>Jadwal</span><strong>${escapeHTML(t.start)} · ${escapeHTML(t.duration)}</strong></div>
            <div class="booking-line"><span>Biaya penuh</span><strong>${rp(t.price)}</strong></div>
            <div class="booking-line"><span>Subsidi contoh</span><strong>− ${rp(t.price - pay)}</strong></div>
            <div class="booking-line total"><span>Kontribusi simulasi</span><strong>${rp(pay)}</strong></div>
          </div>
          <div class="form-grid">
            <div class="form-field"><label for="trName">Nama peserta</label><input class="input" id="trName" name="name" value="${escapeHTML(state.account ? D.demoUser.name : "")}" autofocus><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="trContact">WhatsApp atau email</label><input class="input" id="trContact" name="contact" placeholder="0812... atau nama@email.com"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="trVillage">Asal desa / wilayah</label><input class="input" id="trVillage" name="village" placeholder="Contoh: Ped, Nusa Penida"></div>
            <div class="form-field"><label for="trRole">Peran</label><select class="select" id="trRole" name="role"><option>Pemilik usaha</option><option>Pemandu</option><option>Dive guide</option><option>Kru boat</option><option>UMKM kuliner</option><option>Pengelola koperasi</option></select></div>
          </div>
          <label class="consent-row"><input type="checkbox" name="consent"> <span>Saya memahami pendaftaran ini hanya simulasi dan tidak ada pembayaran nyata.</span></label>
          <span class="field-error" data-training-consent hidden></span>
        </div>
        <div class="wizard-foot"><span class="micro">Kuota contoh: ${t.quota} peserta</span><button class="btn btn-primary" type="submit">Kirim pendaftaran ${icon("send")}</button></div>
      </form>`);
  }

  function submitTraining(form) {
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    let bad = false;
    bad = setFieldError(form, "name", name.length < 2 ? "Isi nama peserta." : "") || bad;
    bad = setFieldError(form, "contact", contact.length < 5 ? "Isi kontak peserta." : "") || bad;
    const consentErr = form.querySelector("[data-training-consent]");
    if (!fd.get("consent")) { consentErr.hidden = false; consentErr.textContent = "Centang pernyataan sebelum mengirim."; bad = true; } else consentErr.hidden = true;
    if (bad) { toast("error", "Periksa pendaftaran", "Lengkapi nama, kontak, dan pernyataan."); return; }
    const now = new Date();
    const code = `PLT-${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(3100 + state.trainingRegs.length + Math.floor(Math.random() * 700))}`;
    const reg = { code, name, contact, village: String(fd.get("village") || "—"), role: String(fd.get("role") || "Peserta"), date: fmtDateTime(now), status: "Terkonfirmasi" };
    state.trainingRegs.unshift(reg);
    saveDynamic();
    closeDialog();
    setTimeout(() => {
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Pendaftaran pelatihan tercatat.</h2>
        <p>Ini simulasi. Tidak ada pendaftaran yang dikirim ke penyelenggara.</p>
        <div class="success-code">${icon("book-open-check")} <span>${escapeHTML(code)}</span></div>
        <div class="success-meta"><div><span>Peserta</span><strong>${escapeHTML(name)}</strong></div><div><span>Peran</span><strong>${escapeHTML(reg.role)}</strong></div><div><span>Status</span><strong>${escapeHTML(reg.status)}</strong></div></div>
        <div class="success-actions"><button class="btn btn-secondary" type="button" data-copy-text="${escapeHTML(code)}">${icon("copy")} Salin kode</button><button class="btn btn-primary" type="button" data-check-code="${escapeHTML(code)}">${icon("clipboard-check")} Cek status</button></div>
      </div>`);
      toast("success", "Pendaftaran dibuat", `${code} · ${name}`);
    }, 140);
  }

  function openAppointment() {
    const next = isoLocal(addDays(new Date(), 2));
    openDialog(`<div class="wizard-head">
        <span class="mini-label">Citta Seva · Meja PAD</span>
        <h2 id="dialogTitle">Buat janji temu.</h2>
        <p>Pilih slot konsultasi simulasi. Petugas akan mengonfirmasi melalui kanal pilihan.</p>
      </div>
      <form id="appointmentForm" novalidate>
        <div class="wizard-body">
          <div class="form-grid">
            <div class="form-field"><label for="apName">Nama</label><input class="input" id="apName" name="name" value="${escapeHTML(state.account ? D.demoUser.name : "")}" autofocus><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="apContact">WhatsApp atau email</label><input class="input" id="apContact" name="contact" placeholder="0812... atau nama@email.com"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="apDate">Tanggal</label><input class="input" id="apDate" name="date" type="date" min="${todayISO()}" value="${next}"><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="apTime">Waktu</label><select class="select" id="apTime" name="time"><option>09.00–10.00 WITA</option><option>10.00–11.00 WITA</option><option>13.00–14.00 WITA</option></select></div>
            <div class="form-field form-field--full"><label for="apPurpose">Topik</label><select class="select" id="apPurpose" name="purpose"><option>PBJT &amp; pelaporan</option><option>Pendaftaran NPWPD</option><option>PBB-P2</option><option>Izin &amp; sertifikasi usaha</option><option>Pembukuan &amp; pajak</option><option>Lainnya</option></select></div>
            <div class="form-field form-field--full"><span class="hint">Kanal layanan</span><div class="radio-cards"><label class="radio-card"><input type="radio" name="channel" value="MPP Klungkung" checked><span class="radio-dot"></span><span>MPP Klungkung</span></label><label class="radio-card"><input type="radio" name="channel" value="Satelit Nusa Penida"><span class="radio-dot"></span><span>Satelit Nusa Penida</span></label></div></div>
            <div class="form-field form-field--full"><label for="apNotes">Catatan <span style="color:var(--muted);font-weight:400">(opsional)</span></label><textarea class="input" id="apNotes" name="notes" rows="2" placeholder="Ringkas pertanyaan agar petugas dapat menyiapkan bahan."></textarea></div>
          </div>
          <label class="consent-row"><input type="checkbox" name="consent"> <span>Saya memahami janji temu ini adalah simulasi.</span></label>
          <span class="field-error" data-appointment-consent hidden></span>
        </div>
        <div class="wizard-foot"><span class="micro">Respons contoh: 1 hari kerja</span><button class="btn btn-primary" type="submit">Buat janji temu ${icon("calendar-check-2")}</button></div>
      </form>`);
  }

  function submitAppointment(form) {
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const contact = String(fd.get("contact") || "").trim();
    const dateValue = String(fd.get("date") || "");
    let bad = false;
    bad = setFieldError(form, "name", name.length < 2 ? "Isi nama." : "") || bad;
    bad = setFieldError(form, "contact", contact.length < 5 ? "Isi kontak yang bisa dihubungi." : "") || bad;
    bad = setFieldError(form, "date", !dateValue ? "Pilih tanggal." : "") || bad;
    const consentErr = form.querySelector("[data-appointment-consent]");
    if (!fd.get("consent")) { consentErr.hidden = false; consentErr.textContent = "Centang pernyataan sebelum mengirim."; bad = true; } else consentErr.hidden = true;
    if (bad) { toast("error", "Periksa janji temu", "Lengkapi data dan pernyataan."); return; }
    const now = new Date();
    const code = `TEMU-${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(302 + state.appointments.length + Math.floor(Math.random() * 600)).padStart(4, "0")}`;
    const appt = { code, name, contact, date: fmtDate(new Date(dateValue + "T00:00:00")), time: String(fd.get("time") || ""), purpose: String(fd.get("purpose") || ""), channel: String(fd.get("channel") || "MPP Klungkung"), notes: String(fd.get("notes") || ""), created: fmtDateTime(now), status: "Terkonfirmasi" };
    state.appointments.unshift(appt);
    saveDynamic();
    closeDialog();
    setTimeout(() => {
      openDialog(`<div class="success-panel">
        <div class="success-icon">${icon("check")}</div>
        <h2 id="dialogTitle">Janji temu tercatat.</h2>
        <p>Ini simulasi. Tidak ada pemesanan slot nyata pada prototipe ini.</p>
        <div class="success-code">${icon("calendar-check-2")} <span>${escapeHTML(code)}</span></div>
        <div class="success-meta"><div><span>Tanggal</span><strong>${escapeHTML(appt.date)}</strong></div><div><span>Waktu</span><strong>${escapeHTML(appt.time)}</strong></div><div><span>Kanal</span><strong>${escapeHTML(appt.channel)}</strong></div></div>
        <div class="success-actions"><button class="btn btn-secondary" type="button" data-copy-text="${escapeHTML(code)}">${icon("copy")} Salin kode</button><button class="btn btn-primary" type="button" data-check-code="${escapeHTML(code)}">${icon("clipboard-check")} Cek status</button></div>
      </div>`);
      toast("success", "Janji temu dibuat", `${code} · ${appt.date}`);
    }, 140);
  }

  /* ---------- sertifikat Citta Vidya ---------- */
  function certificateState() {
    const total = state.articles.length;
    const done = completionCount();
    const eligible = state.quizBest >= 80 || done >= 6;
    return { total, done, eligible, best: state.quizBest, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function renderCertificateBanner() {
    const wrap = $("#eduCertificate");
    if (!wrap) return;
    const c = certificateState();
    wrap.innerHTML = `<div class="cert-banner ${c.eligible ? "is-ready" : ""}">
      <span class="cert-icon">${icon(c.eligible ? "badge-check" : "file-badge")}</span>
      <div class="cert-banner-main"><strong>${c.eligible ? "Sertifikat Citta Vidya siap." : "Sertifikat belajar Citta Vidya."}</strong><span>${c.eligible ? "Masukkan nama pada sertifikat, lalu unduh ringkasannya. Kode verifikasi hanya berlaku pada prototipe." : `Selesaikan minimal 6 materi (${c.done}/${c.total}) atau raih skor kuis 80%. Skor terbaik: ${c.best}%.`}</span></div>
      <div class="cert-banner-actions"><button class="btn ${c.eligible ? "btn-primary" : "btn-secondary"}" type="button" data-open-certificate>${icon("badge-check")} ${c.eligible ? "Buka sertifikat" : "Lihat syarat"}</button><a class="btn btn-ghost" href="#/edukasi">Lanjut belajar</a></div>
    </div>`;
  }

  function openCertificate() {
    const c = certificateState();
    if (!c.eligible) {
      openDialog(`<div class="dialog-pad dialog-pad-top">
        <span class="badge badge-sun">Citta Vidya</span>
        <h2 id="dialogTitle" style="margin-top:11px">Sertifikat belum terbuka.</h2>
        <p style="margin-top:8px;font-size:.86rem;color:var(--muted)">Sertifikat ini adalah simulasi capaian belajar, bukan sertifikasi kompetensi resmi.</p>
        <div class="booking-lines" style="margin-top:16px">
          <div class="booking-line"><span>Materi selesai</span><strong>${c.done} / ${c.total} · syarat minimal 6</strong></div>
          <div class="booking-line"><span>Skor kuis terbaik</span><strong>${c.best}% · syarat minimal 80%</strong></div>
          <div class="booking-line"><span>Berlaku</span><strong>salah satu syarat</strong></div>
        </div>
        <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:18px"><button class="btn btn-primary" type="button" data-cert-scroll-quiz>${icon("circle-help")} Ikuti kuis</button><a class="btn btn-secondary" href="#/edukasi">Buka jalur belajar</a></div>
        <p class="micro" style="margin-top:14px">Ketentuan ini hanya berlaku pada prototipe PESONA.</p>
      </div>`);
      return;
    }
    const defaultName = state.account ? D.demoUser.name : "Peserta PESONA";
    openDialog(`<div class="dialog-pad dialog-pad-top">
      <span class="badge badge-sun">Citta Vidya · sertifikat belajar</span>
      <h2 id="dialogTitle" style="margin-top:11px;font-size:1.65rem">Sertifikat belajar Anda.</h2>
      <p style="margin-top:6px;font-size:.8rem;color:var(--muted)">Ubah nama pada kolom di bawah, lalu unduh ringkasan sertifikat. Ini bukan sertifikasi kompetensi resmi.</p>
      <div class="cert-name-field"><label class="sr-only" for="certName">Nama pada sertifikat</label><input class="input" id="certName" value="${escapeHTML(defaultName)}" autocomplete="name"><button class="btn btn-secondary" type="button" data-cert-download>${icon("download")} Unduh</button></div>
      <div class="certificate" style="margin-top:16px">
        <div class="certificate-top"><div class="certificate-brand"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><rect width="40" height="40" rx="12" fill="currentColor"></rect><path d="M14 29V11h6.2a5.4 5.4 0 1 1 0 10.8H14" fill="none" stroke="#F7F3E8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="28" cy="12.6" r="2.2" fill="#E39B3B"></circle><path d="M14 33h11" stroke="#E39B3B" stroke-width="2" stroke-linecap="round"></path></svg></span><span><strong>PESONA</strong><span>Citta Vidya · Klungkung</span></span></div><span class="certificate-seal">CITTA<br>VIDYA</span></div>
        <div class="certificate-body"><span class="mini-label">Sertifikat belajar · simulasi</span><h2>Belajar pajak &amp; usaha</h2><p>Diberikan kepada</p><div class="certificate-name" id="certNameOut">${escapeHTML(defaultName)}</div><p>atas penyelesaian materi belajar PESONA serta partisipasi dalam kuis Citta Vidya.</p>
          <div class="certificate-meta"><div><span>Materi selesai</span><strong>${c.done}/${c.total}</strong></div><div><span>Skor terbaik</span><strong>${c.best}%</strong></div><div><span>Kode</span><strong>PSN-VIDYA-2026-0184</strong></div><div><span>Tanggal</span><strong>${fmtDate(baseDate)}</strong></div></div>
          <p class="certificate-foot">Dokumen ini dihasilkan oleh prototipe PESONA dan tidak diterbitkan oleh Pemerintah Kabupaten Klungkung. Bukan sertifikasi kompetensi.</p>
        </div>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:16px"><button class="btn btn-primary" type="button" data-cert-download>${icon("download")} Unduh sertifikat</button><button class="btn btn-secondary" type="button" data-copy-text="PSN-VIDYA-2026-0184">${icon("copy")} Salin kode</button></div>
    </div>`, { wide: true });
  }

  function downloadCertificate() {
    const input = $("#certName");
    const name = input ? input.value.trim() || "Peserta PESONA" : (state.account ? D.demoUser.name : "Peserta PESONA");
    const c = certificateState();
    downloadText("sertifikat-citta-vidya.txt", `PESONA — SERTIFIKAT BELAJAR CITTA VIDYA (SIMULASI)\n\nDiberikan kepada: ${name}\nMateri selesai: ${c.done}/${c.total}\nSkor kuis terbaik: ${c.best}%\nKode: PSN-VIDYA-2026-0184\nTanggal: ${fmtDate(new Date())}\n\nDokumen simulasi prototipe PESONA. Bukan sertifikasi kompetensi resmi.`);
  }

  /* ============================================================
     PENCARIAN
     ============================================================ */
  function buildSearchItems() {
    const items = [];
    D.services.forEach((s) => items.push({
      group: "Layanan", type: "Layanan", title: s.title, sub: s.desc, icon: s.icon,
      action: () => openService(s.id)
    }));
    D.taxes.forEach((t) => items.push({
      group: "Jenis pajak", type: "Pajak daerah", title: `${t.name} — ${t.long}`, sub: t.summary, icon: t.icon,
      action: () => openTax(t.id)
    }));
    state.articles.forEach((a) => items.push({
      group: "Materi edukasi", type: "Materi", title: a.title, sub: `${a.category} · ${a.minutes} menit`, icon: "book-open",
      action: () => openArticle(a.id)
    }));
    D.faqs.forEach((f) => items.push({
      group: "Pertanyaan umum", type: "FAQ", title: f.q, sub: f.a, icon: "circle-help",
      action: () => openFaqItem(f)
    }));
    KARYA.providers.forEach((p) => items.push({
      group: "Penyedia usaha", type: "Registry", title: `${p.name} — ${p.categoryLabel}`, sub: `${p.area} · ${rp(p.price)}/${p.unit} · ${providerLevel(p.level).label}`, icon: providerIcon[p.category] || "store",
      action: () => openProviderProfile(p.id)
    }));
    KARYA.trainings.forEach((t) => items.push({
      group: "Pelatihan", type: "Citta Karya", title: t.title, sub: `${t.cat} · ${t.duration} · ${t.provider}`, icon: "book-open-check",
      action: () => openTrainingRegister(t.id)
    }));
    [
      { title: "Registry penyedia & booking", sub: "Cari usaha terverifikasi dan pesan layanan", hash: "#/usaha", icon: "store" },
      { title: "Pelatihan & sertifikasi", sub: "Homestay, guide, dive, kuliner, digital, pajak", hash: "#/usaha", icon: "book-open-check" },
      { title: "Ruang koperasi", sub: "Anggota, listing, dan bagi hasil 80/10/10", hash: "#/usaha", icon: "users" },
      { title: "Janji temu Meja PAD", sub: "Slot konsultasi simulasi", hash: "#/layanan", icon: "calendar-check-2", action: () => openService("temu") },
      { title: "Lacak izin & sertifikasi", sub: "Tracker lima tahap", hash: "#/layanan", icon: "clipboard-check", action: () => openService("izin") },
      { title: "Sertifikat Citta Vidya", sub: "Syarat dan unduh sertifikat belajar", hash: "#/edukasi", icon: "badge-check", action: () => openCertificate() },
      { title: "Kalkulator pajak", sub: "Simulasi lima jenis pajak daerah", hash: "#/kalkulator", icon: "calculator" },
      { title: "Cek status permohonan", sub: "Lacak pendaftaran, laporan, tiket, izin, atau booking", hash: "#/layanan", icon: "clipboard-check", action: () => openService("status") },
      { title: "Akun wajib pajak", sub: "Contoh kewajiban, riwayat, dan ruang usaha", hash: "#/akun", icon: "user-round" }
    ].forEach((p) => items.push({ group: "Halaman", type: "Halaman", title: p.title, sub: p.sub, icon: p.icon, action: p.action || (() => go(p.hash)) }));
    return items;
  }

  function openFaqItem(faq) {
    openDialog(`<div class="dialog-pad dialog-pad-top">
      <span class="badge badge-sun">Pertanyaan umum</span>
      <h2 id="dialogTitle" style="margin-top:11px;font-size:1.5rem">${escapeHTML(faq.q)}</h2>
      <p style="margin-top:11px;font-size:.9rem;line-height:1.7;color:var(--ink-2)">${escapeHTML(faq.a)}</p>
      <div class="note" style="margin-top:16px;padding:13px 15px;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 9px 9px 0;font-size:.8rem;line-height:1.55">Jawaban ini bersifat edukasi umum. Ketentuan resmi mengikuti peraturan dan kanal pemerintah daerah.</div>
      <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:20px"><button class="btn btn-primary" type="button" data-open-service="konsultasi">${icon("message-square-text")} Tanya petugas</button><a class="btn btn-secondary" href="#/edukasi">Buka materi</a></div>
    </div>`);
  }

  function highlight(text, query) {
    const safe = escapeHTML(text);
    if (!query) return safe;
    try {
      const re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      return safe.replace(re, "<mark>$1</mark>");
    } catch (e) { return safe; }
  }

  function renderSearch(query) {
    const q = String(query || "").trim().toLowerCase();
    const all = buildSearchItems();
    let items;
    if (!q) {
      const order = ["Layanan", "Penyedia usaha", "Pelatihan", "Materi edukasi", "Jenis pajak"];
      items = order.flatMap((g) => all.filter((i) => i.group === g).slice(0, g === "Jenis pajak" ? 3 : 4));
    } else {
      items = all.filter((i) => (i.title + " " + i.sub + " " + i.type).toLowerCase().includes(q)).slice(0, 18);
    }
    state.searchResults = items;
    state.searchIndex = items.length ? 0 : -1;
    const body = $("#searchResults");
    if (!items.length) {
      body.innerHTML = `<div class="search-empty"><strong>Tidak ada hasil untuk "${escapeHTML(query)}".</strong>Coba kata kunci lain seperti NPWPD, PBJT, atau kalkulator.</div>`;
      return;
    }
    let html = "";
    let group = "";
    items.forEach((item, index) => {
      if (item.group !== group) {
        group = item.group;
        html += `<div class="search-group-label">${escapeHTML(group)}</div>`;
      }
      html += `<button class="search-item ${index === 0 ? "selected" : ""}" type="button" data-search-index="${index}">
        <span class="search-item-icon">${icon(item.icon)}</span>
        <span class="search-item-main"><strong>${highlight(item.title, query)}</strong><span>${highlight(item.sub, query)}</span></span>
        ${icon("arrow-right")}
      </button>`;
    });
    body.innerHTML = html;
  }

  function openSearch() {
    const d = $("#searchDialog");
    if (!d) return;
    if (!d.open) d.showModal();
    document.body.classList.add("modal-open");
    const input = $("#globalSearch");
    input.value = "";
    renderSearch("");
    setTimeout(() => input.focus(), 50);
  }
  function closeSearch() {
    const d = $("#searchDialog");
    if (d && d.open) d.close();
    if (!dialog.open) document.body.classList.remove("modal-open");
  }
  function updateSearchSelection() {
    $$("#searchResults .search-item").forEach((el) => {
      const active = Number(el.dataset.searchIndex) === state.searchIndex;
      el.classList.toggle("selected", active);
      if (active) el.scrollIntoView({ block: "nearest" });
    });
  }
  function chooseSearchResult(index) {
    const item = state.searchResults[index];
    if (!item) return;
    closeSearch();
    setTimeout(() => item.action(), 60);
  }

  /* ============================================================
     PORTAL PETUGAS
     ============================================================ */
  const admin = D.admin;
  const DONUT_COLORS = ["#2e6b5b", "#6fa48e", "#dda05b", "#c7b58c", "#95a297"];

  function greet() {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  }

  function renderAdmin() {
    const content = $("#adminContent");
    if (!content) return;
    const view = state.adminView;
    $("#adminCrumb").textContent = ADMIN_TITLES[view] || "Ringkasan";
    $$(".admin-nav a").forEach((a) => {
      const active = a.dataset.adminNav === view;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    updateQueueCount();
    updateProviderCount();
    if (view === "pendapatan") content.innerHTML = adminPendapatanHTML();
    else if (view === "wajib-pajak") { content.innerHTML = adminTaxpayersHTML(); renderTaxpayerRows(); }
    else if (view === "usaha") content.innerHTML = adminUsahaHTML();
    else if (view === "layanan") { content.innerHTML = adminServicesHTML(); renderQueueTable(); }
    else if (view === "edukasi") content.innerHTML = adminEducationHTML();
    else content.innerHTML = adminRingkasanHTML();
    bindChartTips();
  }

  function updateQueueCount() {
    const count = ["pendaftaran", "pelaporan", "konsultasi", "pengaduan"].reduce((acc, tab) => {
      return acc + getQueueItems(tab).filter((i) => !/selesai/i.test(i.status)).length;
    }, 0);
    const el = $("#queueCount");
    if (el) el.textContent = count;
  }

  function kpiSpark(values) {
    const max = Math.max(...values, 1);
    return `<span class="kpi-spark">${values.map((v) => `<span style="height:${Math.max(8, Math.round((v / max) * 100))}%"></span>`).join("")}</span>`;
  }

  function kpiCardHTML(label, value, delta, deltaClass, sub, iconName, spark) {
    return `<div class="kpi-card">
      <div class="kpi-top"><span class="kpi-label">${escapeHTML(label)}</span><span class="kpi-icon">${icon(iconName)}</span></div>
      <div class="kpi-value">${value}</div>
      <div class="kpi-sub">${delta ? `<span class="kpi-delta ${deltaClass}">${escapeHTML(delta)}</span>` : ""}<span>${escapeHTML(sub)}</span></div>
      ${kpiSpark(spark)}
    </div>`;
  }

  function chartSVG(mode) {
    const months = admin.months;
    const targetSeries = mode === "cumulative" ? months.map((_, i) => months.slice(0, i + 1).reduce((a, m) => a + m.target, 0)) : months.map((m) => m.target);
    const realSeries = mode === "cumulative" ? months.map((_, i) => months.slice(0, i + 1).reduce((a, m) => a + m.real, 0)) : months.map((m) => m.real);
    const maxRaw = Math.max(...targetSeries, ...realSeries);
    const max = Math.ceil(maxRaw / (mode === "cumulative" ? 20 : 2)) * (mode === "cumulative" ? 20 : 2);
    const W = 780, H = 278, L = 40, R = 16, T = 15, B = 30;
    const x = (i) => L + i * (W - L - R) / (months.length - 1);
    const y = (v) => H - B - (v / max) * (H - T - B);
    const pointsReal = months.map((m, i) => ({ i, v: realSeries[i], real: m.real })).filter((p) => (mode === "cumulative" ? p.i <= 9 : p.i <= 9));
    const pointsTarget = months.map((m, i) => ({ i, v: targetSeries[i] }));
    const realPath = pointsReal.map((p, idx) => `${idx ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
    const targetPath = pointsTarget.map((p, idx) => `${idx ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
    const areaPath = `${realPath} L${x(pointsReal[pointsReal.length - 1].i).toFixed(1)},${H - B} L${x(pointsReal[0].i).toFixed(1)},${H - B} Z`;
    let grid = "";
    for (let g = 0; g <= 4; g++) {
      const val = max * g / 4;
      const gy = y(val);
      const labelVal = Math.round(val * 10) / 10;
      grid += `<line class="grid-line" x1="${L}" y1="${gy.toFixed(1)}" x2="${W - R}" y2="${gy.toFixed(1)}"></line><text x="${L - 7}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${labelVal.toLocaleString("id-ID")}</text>`;
    }
    let xlabels = months.map((m, i) => `<text x="${x(i).toFixed(1)}" y="${H - 8}" text-anchor="middle">${m.m}</text>`).join("");
    let dots = pointsReal.map((p) => {
      const tip = `${months[p.i].m} · Realisasi Rp${months[p.i].real.toFixed(2).replace(".", ",")} M · Target Rp${months[p.i].target.toFixed(2).replace(".", ",")} M`;
      return `<circle class="dot-real" cx="${x(p.i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3.6" tabindex="0" role="img" aria-label="${escapeHTML(tip)}" data-tip="${escapeHTML(tip)}"></circle>`;
    }).join("");
    return `<div class="chart-wrap">
      <svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik realisasi dan target pendapatan pajak daerah tahun ${admin.year}">
        <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e6b5b" stop-opacity="0.22"></stop><stop offset="100%" stop-color="#2e6b5b" stop-opacity="0"></stop></linearGradient></defs>
        ${grid}
        <line class="axis-line" x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}"></line>
        <path class="area-real" d="${areaPath}"></path>
        <path class="line-target" d="${targetPath}"></path>
        <path class="line-real" d="${realPath}" pathLength="1"></path>
        ${dots}
        ${xlabels}
      </svg>
      <div class="chart-tip" aria-hidden="true"></div>
    </div>`;
  }

  function bindChartTips() {
    $$(".dot-real").forEach((dot) => {
      const wrap = dot.closest(".chart-wrap");
      if (!wrap) return;
      const tip = wrap.querySelector(".chart-tip");
      const show = () => {
        if (!tip) return;
        const wr = wrap.getBoundingClientRect();
        const dr = dot.getBoundingClientRect();
        tip.innerHTML = escapeHTML(dot.dataset.tip || "");
        tip.classList.add("visible");
        const tw = tip.offsetWidth;
        let left = dr.left - wr.left + dr.width / 2;
        left = Math.max(tw / 2 + 6, Math.min(left, wr.width - tw / 2 - 6));
        tip.style.left = left + "px";
        tip.style.top = (dr.top - wr.top) + "px";
      };
      const hide = () => tip && tip.classList.remove("visible");
      dot.addEventListener("mouseenter", show);
      dot.addEventListener("focus", show);
      dot.addEventListener("mouseleave", hide);
      dot.addEventListener("blur", hide);
    });
  }

  function donutHTML() {
    const total = admin.taxBreakdown.reduce((a, t) => a + t.real, 0);
    const C = 2 * Math.PI * 62;
    let offset = 0;
    const circles = admin.taxBreakdown.map((t, i) => {
      const pct = t.real / total;
      const len = pct * C;
      const el = `<circle cx="80" cy="80" r="62" stroke="${DONUT_COLORS[i]}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}"></circle>`;
      offset += len;
      return el;
    }).join("");
    return `<div class="donut-wrap">
      <div class="donut-holder">
        <svg class="donut-svg" viewBox="0 0 160 160" role="img" aria-label="Komposisi realisasi pajak daerah">${circles}</svg>
        <div class="donut-center"><strong>${rpM(total)}</strong><span>realisasi</span></div>
      </div>
      <div class="donut-legend">${admin.taxBreakdown.map((t, i) => `<div class="donut-legend-item"><i style="background:${DONUT_COLORS[i]}"></i><span>${escapeHTML(t.name)}</span><strong>${rpM(t.real)}</strong></div>`).join("")}</div>
    </div>`;
  }

  function queuePreviewHTML() {
    const items = [...getQueueItems("pendaftaran").slice(0, 2), ...getQueueItems("konsultasi").slice(0, 2)];
    return items.map((q) => `<div class="queue-item">
      <span class="queue-icon">${icon(q.tab === "pendaftaran" ? "id-card" : "message-square-text")}</span>
      <span class="queue-main"><strong>${escapeHTML(q.name)}</strong><span>${escapeHTML(q.meta)}</span></span>
      <span class="queue-meta"><time>${escapeHTML(q.date.split(" · ")[1] || q.date)}</time><span class="status-chip ${statusTone(q.status)}">${escapeHTML(q.status)}</span><button class="queue-action" type="button" data-admin-queue="${escapeHTML(q.id)}" data-queue-tab="${q.tab}">Lihat</button></span>
    </div>`).join("");
  }

  function adminRingkasanHTML() {
    const delta = ((admin.realization / admin.target) * 100).toFixed(1).replace(".", ",");
    const atRisk = admin.taxpayers.filter((t) => t.status !== "Patuh").slice(0, 5);
    return `<div class="admin-page-head">
      <div><h1>${greet()}, Rina.</h1><p>Ini ringkasan pendapatan dan layanan pajak daerah hari ini. Semua angka adalah simulasi.</p></div>
      <div class="admin-page-actions"><span class="badge badge-muted">Tahun anggaran 2026</span><button class="btn btn-secondary" type="button" data-admin-export="pendapatan">${icon("download")} Unduh CSV</button></div>
    </div>
    <div class="kpi-grid">
      ${kpiCardHTML("Realisasi PAD", "Rp72,62 M", delta + "% target", "up", "dari Rp98,4 M", "trending-up", admin.months.filter((m) => m.real > 0).map((m) => m.real))}
      ${kpiCardHTML("Kepatuhan", "82,6%", "+2,4 pts", "up", "dibanding periode lalu", "shield-check", admin.taxBreakdown.map((t) => t.compliance))}
      ${kpiCardHTML("Wajib pajak aktif", "18.420", "+1.120", "up", "akun terdaftar", "users", [40, 52, 48, 58, 65, 62, 74, 78, 84, 90])}
      ${kpiCardHTML("Piutang", "Rp4,28 M", "−6,2%", "up", "tren menurun", "file-text", [90, 82, 86, 76, 72, 66, 58, 54, 48, 42])}
    </div>
    <div class="dash-grid">
      <div class="dash-card dash-card--8">
        <div class="dash-card-head">
          <div><h2>Realisasi vs target</h2><p>Dalam miliar rupiah · Januari–Oktober 2026</p></div>
          <div class="chart-toolbar"><div class="segmented" role="group" aria-label="Mode grafik"><button type="button" data-chart-mode="monthly" class="${state.adminChartMode === "monthly" ? "active" : ""}">Bulanan</button><button type="button" data-chart-mode="cumulative" class="${state.adminChartMode === "cumulative" ? "active" : ""}">Kumulatif</button></div></div>
        </div>
        ${chartSVG(state.adminChartMode)}
        <div class="chart-legend"><span><i class="legend-line"></i> Realisasi</span><span><i class="legend-line target"></i> Target</span><span>Target tahunan Rp98,4 M</span></div>
      </div>
      <div class="dash-card dash-card--4">
        <div class="dash-card-head"><div><h2>Komposisi realisasi</h2><p>Kontribusi tiap jenis pajak</p></div></div>
        ${donutHTML()}
      </div>
      <div class="dash-card dash-card--7">
        <div class="dash-card-head"><div><h2>Antrean layanan</h2><p>Perlu perhatian petugas</p></div><a class="view-all" href="#/petugas/layanan">Lihat semua ${icon("arrow-right")}</a></div>
        <div class="queue-list">${queuePreviewHTML()}</div>
      </div>
      <div class="dash-card dash-card--5">
        <div class="dash-card-head"><div><h2>Kinerja edukasi</h2><p>Jangkauan kampanye bulan ini</p></div><a class="view-all" href="#/petugas/edukasi">Detail ${icon("arrow-right")}</a></div>
        <div class="campaign-list">${admin.campaigns.map((c) => `<div class="campaign-item"><div class="campaign-top"><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.reach)}</span></div><div class="campaign-bar"><span style="width:${c.rate}%"></span></div><div class="campaign-sub"><span>${escapeHTML(c.desc)}</span><span>${c.rate}%</span></div></div>`).join("")}</div>
      </div>
      <div class="dash-card dash-card--12 admin-table-card" style="padding:0">
        <div class="admin-table-head"><div><h2>Wajib pajak yang perlu perhatian</h2><p>Prioritas tindak lanjut berdasarkan kepatuhan dan tunggakan.</p></div><a class="view-all" href="#/petugas/wajib-pajak">Buka daftar ${icon("arrow-right")}</a></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Wajib pajak</th><th>Jenis</th><th>Wilayah</th><th>Status</th><th>Kepatuhan</th><th class="num">Tunggakan</th><th></th></tr></thead><tbody>
          ${atRisk.map((t) => `<tr><td>${wpCell(t)}</td><td>${escapeHTML(t.type)}</td><td>${escapeHTML(t.area)}</td><td><span class="status-chip ${t.status === "Menunggak" ? "danger" : "warn"}">${escapeHTML(t.status)}</span></td><td>${complianceCell(t.compliance)}</td><td class="num">${t.arrears ? rp(t.arrears) : "—"}</td><td><button class="table-action" type="button" data-admin-tax="${escapeHTML(t.id)}" aria-label="Buka ${escapeHTML(t.name)}">${icon("eye")}</button></td></tr>`).join("")}
        </tbody></table></div>
      </div>
    </div>`;
  }

  function wpCell(t) {
    const initials = t.name.split(" ").filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
    return `<div class="wp-cell"><span class="wp-avatar">${escapeHTML(initials)}</span><span><strong>${escapeHTML(t.name)}</strong><span>${escapeHTML(t.id)}</span></span></div>`;
  }
  function complianceCell(v) {
    const cls = v < 65 ? "critical" : v < 80 ? "low" : "";
    return `<span class="compliance ${cls}"><span class="compliance-bar"><span style="width:${v}%"></span></span><b>${v}%</b></span>`;
  }

  function adminPendapatanHTML() {
    const pct = (admin.realization / admin.target * 100).toFixed(1).replace(".", ",");
    const remaining = admin.target - admin.realization;
    return `<div class="admin-page-head">
      <div><h1>Pendapatan daerah.</h1><p>Realisasi, target, dan komposisi pajak daerah tahun 2026.</p></div>
      <div class="admin-page-actions"><button class="btn btn-secondary" type="button" data-admin-export="pendapatan">${icon("download")} Unduh CSV</button></div>
    </div>
    <div class="revenue-summary">
      <div class="revenue-mini"><span>Target tahunan</span><strong>Rp98,4 M</strong><small>5 jenis pajak daerah</small></div>
      <div class="revenue-mini"><span>Realisasi per Okt</span><strong>Rp72,62 M</strong><small>${pct}% dari target tahunan</small></div>
      <div class="revenue-mini"><span>Sisa target</span><strong>Rp25,78 M</strong><small>November–Desember</small></div>
    </div>
    <div class="dash-grid">
      <div class="dash-card dash-card--12">
        <div class="dash-card-head"><div><h2>Realisasi vs target</h2><p>Dalam miliar rupiah</p></div><div class="segmented"><button type="button" data-chart-mode="monthly" class="${state.adminChartMode === "monthly" ? "active" : ""}">Bulanan</button><button type="button" data-chart-mode="cumulative" class="${state.adminChartMode === "cumulative" ? "active" : ""}">Kumulatif</button></div></div>
        ${chartSVG(state.adminChartMode)}
        <div class="chart-legend"><span><i class="legend-line"></i> Realisasi</span><span><i class="legend-line target"></i> Target</span></div>
      </div>
      <div class="dash-card dash-card--7 admin-table-card" style="padding:0">
        <div class="admin-table-head"><div><h2>Realisasi per jenis pajak</h2><p>Per 31 Oktober 2026 · miliar rupiah</p></div></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Jenis</th><th class="num">Target</th><th class="num">Realisasi</th><th>Capaian</th><th>Kepatuhan</th></tr></thead><tbody>
          ${admin.taxBreakdown.map((t) => `<tr><td><strong style="font-size:.75rem">${escapeHTML(t.name)}</strong></td><td class="num">${t.target.toFixed(1).replace(".", ",")}</td><td class="num">${t.real.toFixed(1).replace(".", ",")}</td><td><span class="status-chip ${t.real / t.target >= .78 ? "ok" : t.real / t.target >= .65 ? "warn" : "danger"}">${Math.round(t.real / t.target * 100)}%</span></td><td>${complianceCell(t.compliance)}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="table-pagination"><span>Total realisasi Rp72,62 M</span><span>Data simulasi</span></div>
      </div>
      <div class="dash-card dash-card--5">
        <div class="dash-card-head"><div><h2>Catatan pendapatan</h2><p>Hal yang perlu dipantau</p></div></div>
        <div class="insight-list">
          <div class="insight"><span class="insight-icon">${icon("trending-up")}</span><div><strong>PBJT masih menjadi penopang utama</strong><span>Kontribusi 61,7% dari realisasi. Kepatuhan 78%, masih ada ruang perbaikan.</span></div></div>
          <div class="insight"><span class="insight-icon">${icon("house")}</span><div><strong>PBB-P2 di bawah laju target</strong><span>Capaian 68,1%. Pemutakhiran data objek dapat membantu ketepatan SPPT.</span></div></div>
          <div class="insight"><span class="insight-icon">${icon("signpost")}</span><div><strong>Reklame perlu pendataan</strong><span>Capaian 58,1% dengan kepatuhan 71%. Prioritaskan verifikasi media baru.</span></div></div>
          <div class="insight"><span class="insight-icon">${icon("file-text")}</span><div><strong>Piutang menurun</strong><span>Rp4,28 M, turun 6,2% dari periode sebelumnya.</span></div></div>
        </div>
      </div>
      <div class="dash-card dash-card--12">
        <div class="dash-card-head"><div><h2>Kepatuhan per jenis pajak</h2><p>Perbandingan indikator simulasi</p></div></div>
        <div class="compliance-grid">
          ${admin.taxBreakdown.map((t) => `<div><div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:6px"><span style="font-size:.75rem;font-weight:650">${escapeHTML(t.name)}</span><strong style="font-size:.75rem">${t.compliance}%</strong></div><div class="campaign-bar"><span style="width:${t.compliance}%"></span></div><div style="font-size:.65rem;color:var(--muted);margin-top:4px">${fmtNum(t.wp)} WP aktif</div></div>`).join("")}
        </div>
      </div>
    </div>`;
  }

  function filteredTaxpayers() {
    const q = state.adminTaxSearch.trim().toLowerCase();
    return admin.taxpayers.filter((t) => {
      if (state.adminTaxStatus !== "all" && t.status !== state.adminTaxStatus) return false;
      if (state.adminTaxType !== "all" && t.type !== state.adminTaxType) return false;
      if (q && !(t.name + " " + t.id + " " + t.area + " " + t.type).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function adminTaxpayersHTML() {
    return `<div class="admin-page-head">
      <div><h1>Wajib pajak.</h1><p>Data contoh untuk simulasi pencarian, penyaringan, dan tindak lanjut.</p></div>
      <div class="admin-page-actions"><button class="btn btn-secondary" type="button" data-admin-export="wajib-pajak">${icon("download")} Unduh CSV</button></div>
    </div>
    <div class="dash-card admin-table-card" style="padding:0">
      <div class="admin-table-head">
        <div><h2>Daftar wajib pajak</h2><p id="wpCount">16 contoh</p></div>
        <div class="table-toolbar">
          <div class="table-search">${icon("search")}<input id="adminTaxSearch" type="search" placeholder="Cari nama, NPWPD, wilayah..." value="${escapeHTML(state.adminTaxSearch)}"></div>
          <select class="select-sm" id="adminTaxStatus" aria-label="Filter status">
            ${["all", "Patuh", "Perlu perhatian", "Menunggak"].map((s) => `<option value="${s}" ${state.adminTaxStatus === s ? "selected" : ""}>${s === "all" ? "Semua status" : s}</option>`).join("")}
          </select>
          <select class="select-sm" id="adminTaxType" aria-label="Filter jenis pajak">
            ${["all", "PBJT", "PBB-P2", "BPHTB", "Reklame", "Air Tanah"].map((s) => `<option value="${s}" ${state.adminTaxType === s ? "selected" : ""}>${s === "all" ? "Semua jenis" : s}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="table-wrap"><table class="admin-table"><thead><tr><th>Wajib pajak</th><th>Jenis</th><th>Wilayah</th><th>Status</th><th>Kepatuhan</th><th class="num">Tunggakan</th><th>Terakhir bayar</th><th></th></tr></thead><tbody id="wpTableBody"></tbody></table></div>
      <div class="table-pagination"><span id="wpPagination">Menampilkan 16 dari 16 contoh</span><div class="pager"><button disabled>‹</button><button class="active">1</button><button disabled>›</button></div></div>
    </div>`;
  }

  function renderTaxpayerRows() {
    const body = $("#wpTableBody");
    if (!body) return;
    const rows = filteredTaxpayers();
    body.innerHTML = rows.length ? rows.map((t) => `<tr>
      <td>${wpCell(t)}</td><td>${escapeHTML(t.type)}</td><td>${escapeHTML(t.area)}</td>
      <td><span class="status-chip ${t.status === "Patuh" ? "ok" : t.status === "Menunggak" ? "danger" : "warn"}">${escapeHTML(t.status)}</span></td>
      <td>${complianceCell(t.compliance)}</td><td class="num">${t.arrears ? rp(t.arrears) : "—"}</td><td style="font-size:.68rem;color:var(--muted)">${escapeHTML(t.last)}</td>
      <td><button class="table-action" type="button" data-admin-tax="${escapeHTML(t.id)}" aria-label="Buka ${escapeHTML(t.name)}">${icon("eye")}</button></td>
    </tr>`).join("") : `<tr><td colspan="8"><div class="admin-empty">Tidak ada wajib pajak yang cocok dengan filter.</div></td></tr>`;
    const count = $("#wpCount");
    if (count) count.textContent = `${rows.length} dari ${admin.taxpayers.length} contoh`;
    const pag = $("#wpPagination");
    if (pag) pag.textContent = `Menampilkan ${rows.length} dari ${admin.taxpayers.length} contoh`;
  }

  function openTaxpayerDrawer(t) {
    const timeline = [
      { date: t.last, title: "Pembayaran terakhir", desc: t.arrears ? "Terdapat tunggakan setelah pembayaran ini." : "Tidak ada tunggakan tercatat pada data contoh.", state: "done" },
      { date: "12 Nov 2026", title: "Pemeriksaan kepatuhan", desc: `Skor kepatuhan ${t.compliance}%. Data ini simulasi.`, state: "done" },
      { date: "Hari ini", title: "Tindak lanjut", desc: t.arrears ? "Kirim pengingat dan tawarkan pendampingan." : "Pertahankan komunikasi rutin.", state: "active" }
    ];
    openDialog(`<div class="drawer-head"><span class="mini-label">Detail wajib pajak</span><h2 id="dialogTitle">${escapeHTML(t.name)}</h2><p>${escapeHTML(t.id)} · ${escapeHTML(t.type)}</p></div>
      <div class="drawer-body">
        <div class="drawer-section"><h3>Profil</h3><div class="drawer-facts"><div><span>Wilayah</span><strong>${escapeHTML(t.area)}</strong></div><div><span>Terdaftar</span><strong>${escapeHTML(t.since)}</strong></div><div><span>Kontak</span><strong>${escapeHTML(t.contact)}</strong></div><div><span>Status</span><strong>${escapeHTML(t.status)}</strong></div></div></div>
        <div class="drawer-section"><h3>Kepatuhan &amp; tunggakan</h3><div style="display:flex;align-items:center;gap:18px"><div style="flex:1"><div class="campaign-bar"><span style="width:${t.compliance}%;background:${t.compliance < 65 ? "var(--danger)" : "var(--ok)"}"></span></div><div style="font-size:.7rem;color:var(--muted);margin-top:5px">Kepatuhan ${t.compliance}%</div></div><div style="text-align:right"><div style="font-family:var(--display);font-size:1.25rem;font-weight:680">${t.arrears ? rp(t.arrears) : "Rp0"}</div><div style="font-size:.65rem;color:var(--muted)">tunggakan</div></div></div></div>
        <div class="drawer-section"><h3>Riwayat singkat</h3><div class="timeline">${timeline.map((s) => `<div class="timeline-item ${s.state}"><span class="timeline-dot"></span><div><h4>${escapeHTML(s.title)}</h4><p>${escapeHTML(s.desc)}</p><span class="tl-date">${escapeHTML(s.date)}</span></div></div>`).join("")}</div></div>
        <div class="drawer-actions"><button class="btn btn-primary" type="button" data-remind="${escapeHTML(t.name)}">${icon("send")} Kirim pengingat</button><button class="btn btn-secondary" type="button" data-toast-info="Riwayat lengkap belum tersedia pada prototipe.">${icon("file-text")} Riwayat lengkap</button></div>
        <p class="micro" style="margin-top:14px">Data dan aksi pada panel ini adalah simulasi. Tidak ada pesan yang benar-benar dikirim.</p>
      </div>`, { drawer: true });
  }

  function getQueueItems(tab) {
    const base = admin.queues[tab] ? admin.queues[tab] : [];
    let items = base.map((q) => ({ ...q, tab, dynamic: false }));
    if (tab === "pendaftaran") {
      items = state.registrations.map((r) => ({
        id: r.code, name: r.data.usaha || r.data.nama, meta: `${r.data.wilayah || "Klungkung"} · ${r.data.jenisUsaha || "Usaha"}`, date: r.date, status: r.status || "Baru", priority: "Tinggi", tab, dynamic: true
      })).concat(items);
    }
    if (tab === "pelaporan") {
      items = state.reports.map((r) => ({
        id: r.code, name: r.name, meta: `${r.taxName} · ${r.periodLabel}`, date: r.date, status: r.status || "Menunggu", priority: "Normal", tab, dynamic: true
      })).concat(items);
    }
    if (tab === "konsultasi") {
      items = state.tickets.map((t) => ({
        id: t.code, name: t.name, meta: t.topic, date: t.date, status: t.status || "Baru", priority: "Tinggi", tab, dynamic: true
      })).concat(items);
    }
    return items.map((q) => ({ ...q, status: state.queueOverrides[q.id] || q.status }));
  }

  function adminServicesHTML() {
    const tabs = [
      ["pendaftaran", "Pendaftaran NPWPD"],
      ["pelaporan", "Pelaporan"],
      ["konsultasi", "Konsultasi"],
      ["pengaduan", "Pengaduan"]
    ];
    return `<div class="admin-page-head">
      <div><h1>Antrean layanan.</h1><p>Kelola permohonan, pelaporan, konsultasi, dan pengaduan contoh.</p></div>
      <div class="admin-page-actions"><span class="badge badge-muted">${getQueueItems("pendaftaran").filter((q) => !/selesai/i.test(q.status)).length} pendaftaran terbuka</span></div>
    </div>
    <div class="queue-tabs" role="tablist" aria-label="Kategori antrean">
      ${tabs.map(([id, label]) => { const count = getQueueItems(id).filter((q) => !/selesai/i.test(q.status)).length; return `<button class="queue-tab ${state.adminQueueTab === id ? "active" : ""}" type="button" data-queue-tab-btn="${id}">${label} <span>${count}</span></button>`; }).join("")}
    </div>
    <div class="dash-card admin-table-card" style="padding:0">
      <div class="admin-table-head"><div><h2 id="adminQueueTitle">${escapeHTML(tabs.find(([id]) => id === state.adminQueueTab)[1])}</h2><p>Klik tindakan untuk melihat detail dan mensimulasikan proses.</p></div></div>
      <div class="table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Subjek</th><th>Tanggal</th><th>Status</th><th>Prioritas</th><th></th></tr></thead><tbody id="adminQueueBody"></tbody></table></div>
      <div class="table-pagination"><span id="queuePagination">—</span><span>Data simulasi</span></div>
    </div>`;
  }

  function renderQueueTable() {
    const body = $("#adminQueueBody");
    if (!body) return;
    const items = getQueueItems(state.adminQueueTab);
    body.innerHTML = items.length ? items.map((q) => `<tr>
      <td><span style="font-family:var(--mono);font-size:.65rem">${escapeHTML(q.id)}</span></td>
      <td><strong style="font-size:.74rem;display:block">${escapeHTML(q.name)}</strong><span style="font-size:.65rem;color:var(--muted)">${escapeHTML(q.meta)}</span></td>
      <td style="font-size:.68rem;color:var(--muted);white-space:nowrap">${escapeHTML(q.date)}</td>
      <td><span class="status-chip ${statusTone(q.status)}">${escapeHTML(q.status)}</span></td>
      <td><span class="status-chip ${q.priority === "Tinggi" ? "warn" : "muted"}">${escapeHTML(q.priority)}</span></td>
      <td><button class="queue-action" type="button" data-admin-queue="${escapeHTML(q.id)}" data-queue-tab="${q.tab}">${/selesai/i.test(q.status) ? "Lihat" : "Proses"} ${icon("arrow-right")}</button></td>
    </tr>`).join("") : `<tr><td colspan="6"><div class="admin-empty">Tidak ada item pada kategori ini.</div></td></tr>`;
    const label = $("#adminQueueTitle");
    const tabs = { pendaftaran: "Pendaftaran NPWPD", pelaporan: "Pelaporan", konsultasi: "Konsultasi", pengaduan: "Pengaduan" };
    if (label) label.textContent = tabs[state.adminQueueTab];
    const pag = $("#queuePagination");
    if (pag) pag.textContent = `${items.length} item · ${items.filter((q) => !/selesai/i.test(q.status)).length} belum selesai`;
    updateQueueCount();
  }

  function openQueueDrawer(id, tab) {
    const q = getQueueItems(tab || state.adminQueueTab).find((x) => x.id === id);
    if (!q) return;
    const labels = { pendaftaran: "Pendaftaran NPWPD", pelaporan: "Pelaporan", konsultasi: "Konsultasi", pengaduan: "Pengaduan" };
    const notes = {
      pendaftaran: "Cocokkan identitas, NIB/izin, dan lokasi usaha. Minta dokumen tambahan bila data belum konsisten.",
      pelaporan: "Bandingkan nilai dasar dengan catatan transaksi. Kembalikan bila data pendukung tidak sesuai.",
      konsultasi: "Jawab melalui kanal yang dipilih. Jangan meminta data sensitif melalui kanal tidak resmi.",
      pengaduan: "Catat kronologi dan bukti. Teruskan ke unit berwenang bila memerlukan tindakan di luar layanan PESONA."
    };
    const docSets = {
      pendaftaran: [
        { icon: "id-card", name: "Identitas pemilik", meta: "KTP · terbaca", status: "Lengkap" },
        { icon: "file-text", name: "NIB / izin usaha", meta: "PDF · sesuai data", status: "Lengkap" },
        { icon: "map-pin", name: "Foto lokasi", meta: "JPG · perlu dicek", status: "Periksa" }
      ],
      pelaporan: [
        { icon: "receipt-text", name: "Rekap transaksi", meta: "XLSX · masa pajak", status: "Lengkap" },
        { icon: "file-text", name: "Bukti pungut", meta: "PDF · sebagian", status: "Periksa" },
        { icon: "credit-card", name: "Bukti setor sebelumnya", meta: "PDF · opsional", status: "Opsional" }
      ],
      konsultasi: [
        { icon: "message-square-text", name: "Pertanyaan awal", meta: "Teks · sudah dibaca", status: "Lengkap" },
        { icon: "file-text", name: "Lampiran pendukung", meta: "Belum ada", status: "Opsional" },
        { icon: "user-round", name: "Identitas pemohon", meta: "Nama dan kanal", status: "Lengkap" }
      ],
      pengaduan: [
        { icon: "file-text", name: "Kronologi", meta: "Teks · sudah dicatat", status: "Lengkap" },
        { icon: "file-text", name: "Bukti pendukung", meta: "1 lampiran contoh", status: "Periksa" },
        { icon: "user-round", name: "Identitas pelapor", meta: "Dirahasiakan (simulasi)", status: "Lengkap" }
      ]
    };
    const docs = docSets[q.tab] || docSets.pendaftaran;
    openDialog(`<div class="drawer-head"><span class="mini-label">${escapeHTML(labels[q.tab])}</span><h2 id="dialogTitle">${escapeHTML(q.name)}</h2><p>${escapeHTML(q.id)} · ${escapeHTML(q.date)}</p></div>
      <div class="drawer-body">
        <div class="drawer-section"><div style="display:flex;gap:7px;flex-wrap:wrap"><span class="status-chip ${statusTone(q.status)}">${escapeHTML(q.status)}</span><span class="status-chip ${q.priority === "Tinggi" ? "warn" : "muted"}">Prioritas ${escapeHTML(q.priority)}</span></div><h3 style="margin-top:14px">Ringkasan</h3><p style="font-size:.8rem;line-height:1.55;color:var(--muted)">${escapeHTML(q.meta)}</p></div>
        <div class="drawer-section"><h3>Data permohonan</h3><div class="drawer-facts"><div><span>Kategori</span><strong>${escapeHTML(labels[q.tab])}</strong></div><div><span>Tanggal masuk</span><strong>${escapeHTML(q.date)}</strong></div><div><span>Prioritas</span><strong>${escapeHTML(q.priority)}</strong></div><div><span>Petugas</span><strong>Rina W. (demo)</strong></div></div></div>
        <div class="drawer-section"><h3>Kelengkapan dokumen</h3><div class="drawer-docs">
          ${docs.map((d) => `<div class="drawer-doc"><span class="doc-item-icon">${icon(d.icon)}</span><span><strong>${escapeHTML(d.name)}</strong><small>${escapeHTML(d.meta)}</small></span><span class="status-chip ${d.status === "Lengkap" ? "ok" : d.status === "Periksa" ? "warn" : "muted"}">${escapeHTML(d.status)}</span></div>`).join("")}
        </div></div>
        <div class="drawer-section"><h3>Catatan pemeriksaan</h3><p style="font-size:.78rem;line-height:1.55;color:var(--ink-2)">${escapeHTML(notes[q.tab] || "")}</p><label class="sr-only" for="queueNote">Catatan internal simulasi</label><textarea class="input" id="queueNote" rows="3" placeholder="Tulis catatan internal simulasi..." style="margin-top:9px"></textarea></div>
        <div class="drawer-section"><h3>Riwayat</h3><div class="timeline">
          <div class="timeline-item done"><span class="timeline-dot"></span><div><h4>Diterima sistem</h4><p>Data awal tercatat pada prototipe.</p><span class="tl-date">${escapeHTML(q.date)}</span></div></div>
          <div class="timeline-item active"><span class="timeline-dot"></span><div><h4>Menunggu tindakan petugas</h4><p>Pilih salah satu tindakan di bawah untuk simulasi.</p><span class="tl-date">Saat ini</span></div></div>
        </div></div>
        <div class="drawer-actions">
          <button class="btn btn-primary" type="button" data-queue-set="${escapeHTML(q.id)}" data-queue-target="${q.tab}" data-queue-status="Selesai">${icon("check")} Selesaikan</button>
          <button class="btn btn-secondary" type="button" data-queue-set="${escapeHTML(q.id)}" data-queue-target="${q.tab}" data-queue-status="Perlu dokumen">${icon("file-text")} Minta dokumen</button>
          <button class="btn btn-ghost" type="button" data-queue-note>${icon("message-square-text")} Simpan catatan</button>
        </div>
        <p class="micro" style="margin-top:14px">Aksi hanya mengubah status di browser Anda. Tidak ada notifikasi yang dikirim.</p>
      </div>`, { drawer: true });
  }

  function setQueueStatus(id, status, tab) {
    state.queueOverrides[id] = status;
    LS.set("queueOverrides", state.queueOverrides);
    toast("success", "Status diperbarui", `${id} · ${status}`);
    closeDialog();
    if (state.adminView === "layanan" || state.adminView === "ringkasan") renderAdmin();
    updateQueueCount();
    void tab;
  }

  function adminEducationHTML() {
    const rows = getAdminEducationRows();
    const totalViews = rows.reduce((a, r) => a + r.views, 0);
    const avg = Math.round(rows.reduce((a, r) => a + r.completion, 0) / rows.length);
    const maxWeek = Math.max(...admin.weeklyReaders);
    return `<div class="admin-page-head">
      <div><h1>Konten edukasi.</h1><p>Pantau jangkauan materi dan tambahkan bahan edukasi baru.</p></div>
      <div class="admin-page-actions"><button class="btn btn-primary" type="button" data-admin-add-content>${icon("plus")} Tulis materi</button></div>
    </div>
    <div class="kpi-grid">
      ${kpiCardHTML("Total pembaca", fmtNum(totalViews), "", "", "akumulasi materi", "eye", admin.education.slice(0, 8).map((e) => e.views / 100))}
      ${kpiCardHTML("Rata-rata selesai", avg + "%", "", "", "dari pembaca materi", "book-open-check", rows.map((r) => r.completion))}
      ${kpiCardHTML("Percobaan kuis", "1.840", "+12%", "up", "bulan ini", "circle-help", [30, 42, 38, 55, 62, 58, 72, 80])}
      ${kpiCardHTML("Materi terbit", String(rows.length), "", "", "termasuk materi baru", "book-open", [4, 5, 6, 7, 8, 9, 9, rows.length])}
    </div>
    <div class="edu-admin-grid">
      <div class="dash-card admin-table-card" style="padding:0">
        <div class="admin-table-head"><div><h2>Kinerja materi</h2><p>Pembaca dan tingkat penyelesaian</p></div></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Materi</th><th class="num">Pembaca</th><th>Penyelesaian</th><th>Status</th><th></th></tr></thead><tbody>
          ${rows.map((r) => `<tr><td><div class="content-main"><strong>${escapeHTML(r.title)}</strong><span>${escapeHTML(r.category || (articleById(r.id) && articleById(r.id).category) || "Materi")}</span></div></td><td class="num">${fmtNum(r.views)}</td><td><span class="compliance"><span class="compliance-bar"><span style="width:${r.completion}%"></span></span><b>${r.completion}%</b></span></td><td><span class="status-chip ${r.status === "Terbit" ? "ok" : "warn"}">${escapeHTML(r.status)}</span></td><td><button class="table-action" type="button" data-admin-open-article="${escapeHTML(r.id)}" aria-label="Buka materi">${icon("eye")}</button></td></tr>`).join("")}
        </tbody></table></div>
      </div>
      <div class="edu-admin-side">
        <div class="dash-card">
          <div class="dash-card-head"><div><h2>Pembaca mingguan</h2><p>Tujuh hari terakhir</p></div></div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:10px">
            ${admin.weeklyReaders.map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;height:100%"><span style="flex:1;display:flex;align-items:flex-end;width:100%"><span style="width:100%;height:${Math.round(v / maxWeek * 100)}%;background:${i === admin.weeklyReaders.length - 1 ? "var(--accent)" : "var(--brand-soft)"};border-radius:4px 4px 0 0;display:block"></span></span><span style="font-size:7.5px;color:var(--muted)">${["S", "S", "R", "K", "J", "S", "M"][i]}</span></div>`).join("")}
          </div>
          <p class="micro" style="margin-top:8px">Data simulasi. Klik materi untuk melihat tampilan pembaca.</p>
        </div>
        <div class="dash-card">
          <div class="dash-card-head"><div><h2>Kampanye</h2><p>Status dan capaian</p></div></div>
          <div class="campaign-list">${admin.campaigns.map((c) => `<div class="campaign-item"><div class="campaign-top"><strong>${escapeHTML(c.name)}</strong><span>${escapeHTML(c.status)}</span></div><div class="campaign-bar"><span style="width:${c.rate}%"></span></div><div class="campaign-sub"><span>${escapeHTML(c.desc)}</span><span>${escapeHTML(c.reach)}</span></div></div>`).join("")}</div>
        </div>
        <div class="admin-tip"><strong>Catatan prototipe</strong>Materi yang ditambahkan melalui form akan muncul di pusat edukasi publik pada browser yang sama. Tidak ada publikasi ke server.</div>
      </div>
    </div>`;
  }


  function updateProviderCount() {
    const el = $("#providerCount");
    if (!el) return;
    el.textContent = getProviderApplications().length;
  }

  function providerAdminCell(p) {
    return `<div class="admin-provider-cell"><span class="admin-provider-icon tone-${p.tone || providerTone[p.category] || "forest"}">${icon(providerIcon[p.category] || "store")}</span><span><strong>${escapeHTML(p.name)}</strong><span>${escapeHTML(p.code || p.id)} · ${escapeHTML(p.area)}</span></span></div>`;
  }

  function adminUsahaHTML() {
    const apps = getProviderApplications();
    const directory = getDirectoryProviders();
    const bookings = [...state.bookings, ...KARYA.sampleBookings];
    const coop = KARYA.cooperative;
    const colors = ["#2e6b5b", "#e39b3b", "#d97b5f"];
    const karya = admin.karya;
    return `<div class="admin-page-head">
      <div><h1>Citta Karya.</h1><p>Registry penyedia, verifikasi, booking, dan ruang koperasi. Semua data adalah simulasi.</p></div>
      <div class="admin-page-actions"><span class="badge badge-muted">${apps.length} pengajuan menunggu</span><a class="btn btn-secondary" href="#/usaha">${icon("arrow-up-right")} Lihat halaman publik</a></div>
    </div>
    <div class="kpi-grid">
      ${kpiCardHTML("Penyedia terverifikasi", fmtNum(karya.providersVerified + directory.filter((p) => p.id && p.id.startsWith("local-")).length), "+12 bulan ini", "up", "registry aktif", "store", [12, 18, 24, 31, 39, 46, 55, 64])}
      ${kpiCardHTML("Pengajuan menunggu", fmtNum(apps.length), "", "", "perlu verifikasi", "inbox", [8, 6, 9, 7, 5, 6, 4, apps.length])}
      ${kpiCardHTML("Booking bulan ini", fmtNum(karya.bookingsMonth + state.bookings.length), "+18%", "up", "transaksi tercatat", "calendar-check-2", [22, 30, 38, 44, 52, 60, 71, 84])}
      ${kpiCardHTML("PAD tervalidasi", "Rp" + Number(karya.validatedPad).toFixed(1).replace(".", ",") + " M", "+0,4 M", "up", "dari kanal PESONA", "trending-up", [10, 14, 17, 19, 22, 26, 30, 35])}
    </div>
    <div class="dash-grid">
      <div class="dash-card dash-card--7 admin-table-card" style="padding:0">
        <div class="admin-table-head"><div><h2>Pengajuan penyedia</h2><p>Verifikasi NIB, NPWPD, dan kelengkapan layanan.</p></div><span class="badge badge-sun">${apps.length} item</span></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Usaha</th><th>Kategori</th><th>Wilayah</th><th>Dokumen</th><th>Status</th><th></th></tr></thead><tbody>
          ${apps.length ? apps.map((p) => `<tr><td>${providerAdminCell(p)}</td><td>${escapeHTML(p.categoryLabel || providerCategoryLabel(p.category))}</td><td>${escapeHTML(p.area)}</td><td>${escapeHTML(p.docs || "—")}</td><td><span class="status-chip ${statusTone(p.status)}">${escapeHTML(p.status)}</span></td><td><button class="queue-action" type="button" data-provider-admin="${escapeHTML(p.id)}">Tinjau ${icon("arrow-right")}</button></td></tr>`).join("") : `<tr><td colspan="6"><div class="admin-empty">Tidak ada pengajuan menunggu. Pengajuan baru dari halaman publik akan muncul di sini.</div></td></tr>`}
        </tbody></table></div>
        <div class="table-pagination"><span>Data simulasi · pengajuan pengguna tersimpan di browser</span><span>${apps.length} pengajuan</span></div>
      </div>
      <div class="dash-card dash-card--5">
        <div class="dash-card-head"><div><h2>${escapeHTML(coop.name)}</h2><p>Ruang koperasi · ${escapeHTML(coop.area)}</p></div><span class="badge badge-forest">Operator warga</span></div>
        <div class="coop-snapshot">${coop.report.map((r) => `<div><span>${escapeHTML(r.label)}</span><strong>${escapeHTML(r.value)}</strong></div>`).join("")}</div>
        <div class="coop-split-list">${coop.split.map((s, i) => `<div class="coop-split-row"><i style="background:${colors[i]}"></i><span>${escapeHTML(s.label)}</span><strong>${s.pct}%</strong></div>`).join("")}</div>
        <p class="micro" style="margin-top:12px">${escapeHTML(coop.note)}</p>
      </div>
      <div class="dash-card dash-card--12 admin-table-card" style="padding:0">
        <div class="admin-table-head"><div><h2>Booking dan transaksi</h2><p>Transaksi tercatat dari registry. PBJT dihitung sebagai ilustrasi.</p></div><span class="badge badge-muted">${bookings.length} contoh</span></div>
        <div class="table-wrap"><table class="admin-table"><thead><tr><th>Kode</th><th>Penyedia</th><th>Tanggal</th><th class="num">Subtotal</th><th class="num">PBJT</th><th class="num">Total</th><th>Status</th></tr></thead><tbody>
          ${bookings.map((b) => `<tr><td class="booking-code">${escapeHTML(b.code)}</td><td><strong style="font-size:.74rem">${escapeHTML(b.provider)}</strong><span style="display:block;font-size:.62rem;color:var(--muted)">${escapeHTML(String(b.qty || 1))} unit · ${escapeHTML(b.channel || "QRIS")}</span></td><td style="font-size:.68rem;color:var(--muted)">${escapeHTML(b.date)}</td><td class="num">${rp(b.subtotal)}</td><td class="num">${rp(b.tax)}</td><td class="num"><strong>${rp(b.total)}</strong></td><td><span class="status-chip ${statusTone(b.status)}">${escapeHTML(b.status)}</span></td></tr>`).join("")}
        </tbody></table></div>
        <div class="table-pagination"><span>Total contoh: ${rp(bookings.reduce((a, b) => a + b.total, 0))}</span><span>Data simulasi</span></div>
      </div>
      <div class="dash-card dash-card--12">
        <div class="dash-card-head"><div><h2>Pelatihan &amp; sertifikasi</h2><p>Kuota dan peserta contoh</p></div><a class="view-all" href="#/usaha">Buka katalog ${icon("arrow-right")}</a></div>
        <div class="campaign-list">${KARYA.trainings.map((t) => `<div class="campaign-item"><div class="campaign-top"><strong>${escapeHTML(t.title)}</strong><span>${escapeHTML(t.start)} · kuota ${t.quota}</span></div><div class="campaign-bar"><span style="width:${Math.max(18, 100 - (t.quota % 7) * 9)}%"></span></div><div class="campaign-sub"><span>${escapeHTML(t.provider)}</span><span>${t.certified ? "Sertifikasi" : "Pelatihan"}</span></div></div>`).join("")}</div>
      </div>
    </div>`;
  }

  function openProviderAdminDrawer(id) {
    const p = [...state.providers, ...KARYA.providerQueue.map((x) => ({ ...x, status: providerStatus(x) }))].find((x) => x.id === id);
    if (!p) return;
    const verified = p.status === "Terverifikasi";
    openDialog(`<div class="drawer-head"><span class="mini-label">Verifikasi penyedia</span><h2 id="dialogTitle">${escapeHTML(p.name)}</h2><p>${escapeHTML(p.code || p.id)} · ${escapeHTML(p.area)}</p></div>
      <div class="drawer-body">
        <div class="drawer-section"><div style="display:flex;gap:7px;flex-wrap:wrap"><span class="status-chip ${statusTone(p.status)}">${escapeHTML(p.status)}</span><span class="status-chip muted">${escapeHTML(providerLevel(p.level).label)}</span></div><h3 style="margin-top:14px">Profil usaha</h3><p style="font-size:.8rem;line-height:1.55;color:var(--muted)">${escapeHTML(p.desc)}</p></div>
        <div class="drawer-section"><h3>Data verifikasi</h3><div class="drawer-facts"><div><span>Kategori</span><strong>${escapeHTML(p.categoryLabel || providerCategoryLabel(p.category))}</strong></div><div><span>Dokumen</span><strong>${escapeHTML(p.docs || "—")}</strong></div><div><span>Harga</span><strong>${rp(p.price)} / ${escapeHTML(p.unit)}</strong></div><div><span>Kontak</span><strong>${escapeHTML(p.contact || "—")}</strong></div><div><span>NIB / NPWPD</span><strong>${(p.licenses || []).join(" · ") || "—"}</strong></div><div><span>Pengajuan</span><strong>${escapeHTML(p.submitted || "Data contoh")}</strong></div></div></div>
        <div class="drawer-section"><h3>Sertifikasi</h3><div class="tax-chips">${(p.certifications || []).length ? p.certifications.map((c) => `<span>${escapeHTML(c)}</span>`).join("") : "<span>Belum ada</span>"}</div></div>
        <div class="drawer-section"><h3>Catatan</h3><p style="font-size:.78rem;line-height:1.55;color:var(--ink-2)">Verifikasi hanya untuk tampil di registry. PESONA tidak menerbitkan izin dan tidak memungut pembayaran. Data ini simulasi.</p></div>
        <div class="drawer-actions">
          ${verified ? `<button class="btn btn-secondary" type="button" data-provider-admin-profile="${escapeHTML(p.id)}">${icon("eye")} Lihat profil publik</button>` : `<button class="btn btn-primary" type="button" data-provider-verify="${escapeHTML(p.id)}">${icon("badge-check")} Verifikasi &amp; tampilkan</button><button class="btn btn-secondary" type="button" data-provider-docs="${escapeHTML(p.id)}">${icon("file-text")} Minta dokumen</button>`}
        </div>
        <p class="micro" style="margin-top:14px">Aksi hanya mengubah status di browser Anda.</p>
      </div>`, { drawer: true });
  }

  function setProviderStatus(id, status) {
    const local = state.providers.find((p) => p.id === id);
    if (local) {
      local.status = status;
      if (status === "Terverifikasi") { local.verified = "Terverifikasi"; local.level = Math.max(1, local.level || 1); }
    } else {
      state.providerOverrides[id] = status;
      LS.set("providerOverrides", state.providerOverrides);
    }
    saveDynamic();
    updateProviderCount();
    toast(status === "Terverifikasi" ? "success" : "info", status === "Terverifikasi" ? "Penyedia terverifikasi" : "Dokumen diminta", status === "Terverifikasi" ? "Usaha akan tampil di registry publik." : "Status pengajuan diperbarui pada simulasi.");
    closeDialog();
    if (state.adminView === "usaha" || state.adminView === "ringkasan") renderAdmin();
    if (state.currentView === "usaha") renderUsaha();
  }

  function getAdminEducationRows() {
    const custom = state.customArticles.map((a) => ({ id: a.id, title: a.title, views: 0, completion: 0, status: "Terbit", category: a.category, custom: true }));
    return [...custom, ...admin.education];
  }

  function openContentForm() {
    openDialog(`<div class="wizard-head"><span class="mini-label">Konten edukasi</span><h2 id="dialogTitle">Tulis materi baru</h2><p>Form simulasi. Materi akan tampil di pusat edukasi setelah disimpan.</p></div>
      <form id="contentForm" novalidate>
        <div class="wizard-body">
          <div class="form-grid">
            <div class="form-field form-field--full"><label for="ctTitle">Judul materi</label><input class="input" id="ctTitle" name="title" placeholder="Contoh: Memahami faktur pajak daerah" autofocus><span class="field-error" hidden></span></div>
            <div class="form-field"><label for="ctCategory">Kategori</label><select class="select" id="ctCategory" name="category">${["PBJT", "PBB-P2", "BPHTB", "Reklame", "PAT", "Administrasi", "Pembayaran", "Kepatuhan", "Panduan"].map((c) => `<option>${c}</option>`).join("")}</select></div>
            <div class="form-field"><label for="ctMinutes">Estimasi baca (menit)</label><input class="input" id="ctMinutes" name="minutes" type="number" min="1" max="30" value="5"></div>
            <div class="form-field form-field--full"><label for="ctSummary">Ringkasan</label><textarea class="input" id="ctSummary" name="summary" rows="3" placeholder="Satu atau dua kalimat yang menjelaskan isi materi."></textarea><span class="field-error" hidden></span></div>
            <div class="form-field form-field--full"><label for="ctBody">Isi singkat</label><textarea class="input" id="ctBody" name="body" rows="4" placeholder="Paragraf pembuka materi. Boleh dikosongkan."></textarea></div>
          </div>
          <p class="micro" style="margin-top:8px">Materi akan langsung muncul di pusat edukasi publik pada browser ini.</p>
        </div>
        <div class="wizard-foot"><span class="micro">Hanya prototipe</span><button class="btn btn-primary" type="submit">${icon("save")} Simpan materi</button></div>
      </form>`, { wide: true });
  }

  function submitContent(form) {
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const summary = String(fd.get("summary") || "").trim();
    const bodyText = String(fd.get("body") || "").trim();
    let bad = false;
    bad = setFieldError(form, "title", title.length < 6 ? "Judul minimal 6 karakter." : "") || bad;
    bad = setFieldError(form, "summary", summary.length < 10 ? "Ringkasan minimal 10 karakter." : "") || bad;
    if (bad) { toast("error", "Periksa materi", "Lengkapi judul dan ringkasan."); return; }
    const now = new Date();
    const article = {
      id: "custom-" + now.getTime(),
      title,
      category: String(fd.get("category") || "Panduan"),
      minutes: Math.max(1, num(fd.get("minutes")) || 5),
      level: "Dasar",
      module: "dasar",
      excerpt: summary,
      body: [
        { t: "p", x: summary },
        { t: "p", x: bodyText || "Materi ini ditambahkan melalui portal petugas pada prototipe PESONA." },
        { t: "note", x: "Materi baru pada prototipe. Ketentuan resmi mengikuti peraturan yang berlaku." }
      ],
      takeaways: ["Materi disusun dengan bahasa sederhana.", "Gunakan fitur konsultasi untuk kasus spesifik.", "Periksa kanal resmi untuk ketentuan terbaru."],
      custom: true,
      createdAt: fmtDateTime(now)
    };
    state.customArticles.unshift(article);
    saveCustomArticles();
    syncArticleLists();
    closeDialog();
    toast("success", "Materi diterbitkan", title);
    renderAdmin();
    if (state.currentView === "edukasi") renderEducation();
    if (state.currentView === "beranda") renderHome();
  }

  function downloadText(filename, text) {
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("success", "Berkas disiapkan", filename);
    } catch (e) { toast("error", "Unduhan gagal", "Browser tidak mendukung unduhan ini."); }
  }

  function exportCSV(kind) {
    let rows = [];
    if (kind === "wajib-pajak") {
      rows = [["NPWPD", "Nama", "Jenis", "Wilayah", "Status", "Kepatuhan", "Tunggakan", "Terakhir bayar"]];
      filteredTaxpayers().forEach((t) => rows.push([t.id, t.name, t.type, t.area, t.status, t.compliance + "%", t.arrears, t.last]));
    } else {
      rows = [["Bulan", "Target (miliar)", "Realisasi (miliar)", "Capaian"]];
      admin.months.forEach((m) => rows.push([m.m, m.target, m.real, m.target ? Math.round(m.real / m.target * 100) + "%" : "—"]));
      rows.push([]);
      rows.push(["Jenis pajak", "Target", "Realisasi", "Kepatuhan", "WP aktif"]);
      admin.taxBreakdown.forEach((t) => rows.push([t.name, t.target, t.real, t.compliance + "%", t.wp]));
      rows.push([]);
      rows.push(["Total target", admin.target]);
      rows.push(["Total realisasi", admin.realization]);
    }
    const csv = "\uFEFF" + rows.map((r) => r.map((cell) => `"${String(cell == null ? "" : cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    downloadText(`pesona-${kind}-2026.csv`, csv);
  }

  /* ============================================================
     INTERAKSI UMUM
     ============================================================ */
  function copyText(text) {
    const value = String(text || "");
    const finish = () => toast("success", "Disalin", "Teks sudah disalin ke papan klip.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(finish).catch(() => fallbackCopy(value, finish));
    } else {
      fallbackCopy(value, finish);
    }
  }
  function fallbackCopy(value, done) {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      done();
    } catch (e) {
      toast("error", "Gagal menyalin", "Browser memblokir akses papan klip.");
    }
  }
  function formatMoneyInput(input) {
    const digits = input.value.replace(/\D/g, "");
    input.value = digits ? Number(digits).toLocaleString("id-ID") : "";
  }

  function onClick(e) {
    if (!e.target.closest(".notif-wrap")) closeNotif();

    if (e.target.closest("#themeToggle") || e.target.closest("#adminThemeToggle")) { toggleTheme(); return; }
    if (e.target.closest("#searchTrigger") || e.target.closest("#adminSearch")) { openSearch(); return; }
    if (e.target.closest("#mobileMenuBtn")) { toggleMobileNav(); return; }
    if (e.target.closest("#loginBtn")) {
      if (state.account) go("#/akun"); else openLogin();
      return;
    }
    if (e.target.closest("#notifTrigger")) {
      if ($("#notifPop").hidden) openNotif(); else closeNotif();
      return;
    }
    if (e.target.closest("#markRead")) { markAllNotifRead(); return; }
    if (e.target.closest("#dialogClose")) { closeDialog(); return; }
    if (e.target.closest("#calPrev")) {
      state.calOffset -= 1; state.calSelected = null; renderCalendar(); return;
    }
    if (e.target.closest("#calNext")) {
      state.calOffset += 1; state.calSelected = null; renderCalendar(); return;
    }
    if (e.target.closest("#heroCalcBtn")) {
      const amount = num($("#heroOmzet").value);
      state.calcType = "pbjt";
      state.calcValues.pbjt = { ...calcConfigs.pbjt.defaults, omzet: amount || 25000000 };
      go("#/kalkulator");
      return;
    }
    if (e.target.closest("#calcReset")) {
      state.calcValues[state.calcType] = { ...calcConfigs[state.calcType].defaults };
      renderCalculator();
      toast("info", "Kalkulator direset", "Nilai kembali ke contoh awal.");
      return;
    }
    if (e.target.closest("#resultCopy")) {
      readCalcValues(); updateCalcResult(); copyText(calcSummaryText()); return;
    }
    if (e.target.closest("#resultConsult")) {
      readCalcValues(); updateCalcResult();
      openConsultation({ topic: "Perhitungan pajak", message: calcSummaryText() });
      return;
    }
    if (e.target.closest("#resetProgress")) {
      state.completed.clear(); saveCompleted();
      state.quizBest = 0; LS.set("quizBest", 0);
      state.quiz = { index: 0, selected: null, answered: false, score: 0, finished: false };
      renderEducation();
      toast("info", "Progres direset", "Semua tanda materi selesai telah dihapus.");
      return;
    }
    if (e.target.closest("#clearEduFilter")) {
      state.eduFilter = "all"; state.eduSearch = ""; $("#eduSearch").value = "";
      renderEduFilters(); renderArticleResults(); return;
    }
    if (e.target.closest("#resetDemo")) {
      const ok = window.confirm("Hapus semua data demo di browser ini? Tindakan ini tidak dapat dibatalkan.");
      if (!ok) return;
      Object.keys(localStorage).filter((k) => k.startsWith("pesona.")).forEach((k) => localStorage.removeItem(k));
      location.reload();
      return;
    }
    if (e.target.closest("#adminMenuBtn")) {
      const open = document.body.classList.toggle("admin-menu-open");
      $("#adminMenuBtn").setAttribute("aria-expanded", String(open));
      return;
    }
    if (e.target.closest("#sidebarClose") || e.target.closest("#adminScrim")) {
      document.body.classList.remove("admin-menu-open");
      $("#adminMenuBtn").setAttribute("aria-expanded", "false");
      return;
    }
    if (e.target.closest("#adminLogout")) {
      document.body.classList.remove("admin-mode", "admin-menu-open");
      go("#/beranda");
      toast("info", "Keluar dari portal petugas", "Anda kembali ke situs warga.");
      return;
    }
    if (e.target.closest(".admin-nav a") || e.target.closest(".mobile-nav a")) {
      document.body.classList.remove("admin-menu-open");
      $("#adminMenuBtn").setAttribute("aria-expanded", "false");
      // navigasi hash tetap diproses browser
    }

    const notif = e.target.closest("[data-notif-id]");
    if (notif) {
      const id = notif.dataset.notifId;
      if (!state.notifRead.includes(id)) { state.notifRead.push(id); LS.set("notifRead", state.notifRead); renderNotifications(); }
      closeNotif();
      if (id === "n2") jumpToStatus("NPWPD-2026-0184");
      else if (id === "n3") go("#/edukasi");
      else if (id === "n4") go("#/petugas/usaha");
      else go("#/akun");
      return;
    }
    const searchItem = e.target.closest("[data-search-index]");
    if (searchItem) { chooseSearchResult(Number(searchItem.dataset.searchIndex)); return; }

    const loginRole = e.target.closest("[data-login-role]");
    if (loginRole) { loginAs(loginRole.dataset.loginRole); return; }
    if (e.target.closest("[data-login-open]")) { openLogin(); return; }
    if (e.target.closest("[data-account-logout]")) { logoutAccount(); return; }

    const taxEl = e.target.closest("[data-tax-id]");
    if (taxEl) { e.preventDefault(); openTax(taxEl.dataset.taxId); return; }
    const articleEl = e.target.closest("[data-article-id]");
    if (articleEl) { e.preventDefault(); openArticle(articleEl.dataset.articleId); return; }
    const serviceEl = e.target.closest("[data-open-service]");
    if (serviceEl) { e.preventDefault(); openService(serviceEl.dataset.openService); return; }
    const providerFilter = e.target.closest("[data-provider-filter]");
    if (providerFilter) { state.providerFilter = providerFilter.dataset.providerFilter; renderProviderFilters(); renderProviderGrid(); return; }
    if (e.target.closest("[data-reset-provider]")) {
      state.providerFilter = "all"; state.providerArea = "all"; state.providerSearch = "";
      const input = $("#providerSearch"); if (input) input.value = "";
      renderProviderFilters(); renderProviderGrid(); return;
    }
    if (e.target.closest("[data-provider-apply]")) { openProviderForm(); return; }
    const providerOpen = e.target.closest("[data-provider-open]");
    if (providerOpen) { openProviderProfile(providerOpen.dataset.providerOpen); return; }
    const providerBook = e.target.closest("[data-book-provider]");
    if (providerBook) { openBooking(providerBook.dataset.bookProvider); return; }
    const trainingReg = e.target.closest("[data-training-register]");
    if (trainingReg) { openTrainingRegister(trainingReg.dataset.trainingRegister); return; }
    if (e.target.closest("[data-koperasi-report]")) { openKoperasiReport(); return; }
    if (e.target.closest("[data-open-certificate]")) { openCertificate(); return; }
    if (e.target.closest("[data-cert-download]")) { downloadCertificate(); return; }
    if (e.target.closest("[data-cert-scroll-quiz]")) {
      closeDialog();
      if (state.currentView !== "edukasi") {
        go("#/edukasi");
        setTimeout(() => $("#quizCard")?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
      } else {
        $("#quizCard")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    const gotoEl = e.target.closest("[data-goto]");
    if (gotoEl) { e.preventDefault(); closeMobileNav(); go(gotoEl.dataset.goto); return; }
    if (e.target.closest("[data-scroll-status]")) { e.preventDefault(); openService("status"); return; }
    if (e.target.closest("[data-scroll-flow]")) {
      e.preventDefault();
      $("#alur-pajak")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const flowTab = e.target.closest("[data-flow-step]");
    if (flowTab) { state.flowStep = Number(flowTab.dataset.flowStep); renderFlow(state.flowStep); return; }
    const ann = e.target.closest("[data-announcement]");
    if (ann) { e.preventDefault(); openAnnouncement(Number(ann.dataset.announcement)); return; }

    const acc = e.target.closest("[data-acc-trigger]");
    if (acc) {
      const item = acc.closest(".acc-item");
      const open = acc.getAttribute("aria-expanded") === "true";
      const siblings = item.parentElement.querySelectorAll(".acc-item.open");
      siblings.forEach((sib) => {
        if (sib !== item) {
          sib.classList.remove("open");
          const btn = sib.querySelector("[data-acc-trigger]");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });
      acc.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("open", !open);
      return;
    }

    const calDay = e.target.closest("[data-cal-day]");
    if (calDay) {
      const iso = calDay.dataset.calDay;
      const selected = new Date(iso + "T00:00:00");
      const now = new Date();
      const view = new Date(now.getFullYear(), now.getMonth() + state.calOffset, 1);
      if (selected.getFullYear() !== view.getFullYear() || selected.getMonth() !== view.getMonth()) {
        state.calOffset += (selected.getFullYear() - view.getFullYear()) * 12 + (selected.getMonth() - view.getMonth());
      }
      state.calSelected = iso;
      renderCalendar();
      return;
    }

    const sample = e.target.closest("[data-sample-code]");
    if (sample) {
      const input = $("#statusCode");
      if (input) input.value = sample.dataset.sampleCode;
      checkStatusCode(sample.dataset.sampleCode);
      return;
    }
    const filter = e.target.closest("[data-edu-filter]");
    if (filter) { setEduFilter(filter.dataset.eduFilter); return; }
    const path = e.target.closest("[data-path]");
    if (path) {
      e.preventDefault();
      setEduFilter("module:" + path.dataset.path);
      return;
    }
    const clear = e.target.closest("[data-quiz-option]");
    if (clear) {
      if (state.quiz.answered || state.quiz.finished) return;
      state.quiz.selected = Number(clear.dataset.quizOption);
      state.quiz.answered = true;
      if (state.quiz.selected === D.quiz[state.quiz.index].answer) state.quiz.score += 1;
      renderQuiz();
      return;
    }
    if (e.target.closest("[data-quiz-next]")) {
      if (!state.quiz.answered) return;
      if (state.quiz.index >= D.quiz.length - 1) state.quiz.finished = true;
      else state.quiz.index += 1;
      state.quiz.selected = null;
      state.quiz.answered = false;
      renderQuiz();
      return;
    }
    if (e.target.closest("[data-quiz-restart]")) {
      state.quiz = { index: 0, selected: null, answered: false, score: 0, finished: false };
      renderQuiz();
      return;
    }
    const calcTab = e.target.closest("[data-calc-tab]");
    if (calcTab) {
      readCalcValues();
      state.calcType = calcTab.dataset.calcTab;
      renderCalculator();
      return;
    }
    const preset = e.target.closest("[data-preset-calc]");
    if (preset) {
      const id = preset.dataset.presetCalc;
      if (calcConfigs[id]) {
        state.calcType = id;
        state.calcValues[id] = { ...calcConfigs[id].defaults };
      }
      closeDialog();
      go("#/kalkulator");
      return;
    }
    const mark = e.target.closest("[data-mark-complete]");
    if (mark) { toggleArticleDone(mark.dataset.markComplete); return; }
    const copy = e.target.closest("[data-copy-text]");
    if (copy) { copyText(copy.dataset.copyText); return; }
    const dl = e.target.closest("[data-download-name]");
    if (dl) { downloadText(dl.dataset.downloadName, dl.dataset.downloadText || ""); return; }
    const check = e.target.closest("[data-check-code]");
    if (check) { jumpToStatus(check.dataset.checkCode); return; }
    if (e.target.closest("[data-wizard-back]")) { wizardBack(); return; }
    const edit = e.target.closest("[data-wizard-edit]");
    if (edit) { collectWizardData(); state.wizard.step = Number(edit.dataset.wizardEdit); renderWizard(); return; }

    const chartMode = e.target.closest("[data-chart-mode]");
    if (chartMode) { state.adminChartMode = chartMode.dataset.chartMode; renderAdmin(); return; }
    const exportBtn = e.target.closest("[data-admin-export]");
    if (exportBtn) { exportCSV(exportBtn.dataset.adminExport); return; }
    const adminTax = e.target.closest("[data-admin-tax]");
    if (adminTax) {
      const t = admin.taxpayers.find((x) => x.id === adminTax.dataset.adminTax);
      if (t) openTaxpayerDrawer(t);
      return;
    }
    const queueOpen = e.target.closest("[data-admin-queue]");
    if (queueOpen) { openQueueDrawer(queueOpen.dataset.adminQueue, queueOpen.dataset.queueTab || state.adminQueueTab); return; }
    const queueTab = e.target.closest("[data-queue-tab-btn]");
    if (queueTab) { state.adminQueueTab = queueTab.dataset.queueTabBtn; renderAdmin(); return; }
    const queueSet = e.target.closest("[data-queue-set]");
    if (queueSet) { setQueueStatus(queueSet.dataset.queueSet, queueSet.dataset.queueStatus, queueSet.dataset.queueTarget); return; }
    if (e.target.closest("[data-queue-note]")) {
      const note = $("#queueNote");
      const value = note ? note.value.trim() : "";
      toast(value ? "success" : "info", value ? "Catatan simulasi disimpan" : "Belum ada catatan", value ? "Catatan hanya tersimpan di sesi ini dan tidak dikirim." : "Tulis catatan terlebih dahulu.");
      return;
    }
    if (e.target.closest("[data-admin-add-content]")) { openContentForm(); return; }
    const adminArticle = e.target.closest("[data-admin-open-article]");
    if (adminArticle) { openArticle(adminArticle.dataset.adminOpenArticle); return; }
    const adminProvider = e.target.closest("[data-provider-admin]");
    if (adminProvider) { openProviderAdminDrawer(adminProvider.dataset.providerAdmin); return; }
    const verifyProvider = e.target.closest("[data-provider-verify]");
    if (verifyProvider) { setProviderStatus(verifyProvider.dataset.providerVerify, "Terverifikasi"); return; }
    const docsProvider = e.target.closest("[data-provider-docs]");
    if (docsProvider) { setProviderStatus(docsProvider.dataset.providerDocs, "Perlu dokumen"); return; }
    const adminProviderProfile = e.target.closest("[data-provider-admin-profile]");
    if (adminProviderProfile) { openProviderProfile(adminProviderProfile.dataset.providerAdminProfile); return; }
    const remind = e.target.closest("[data-remind]");
    if (remind) { toast("success", "Pengingat disimulasikan", `Pesan untuk ${remind.dataset.remind} tidak benar-benar dikirim.`); return; }
    const info = e.target.closest("[data-toast-info]");
    if (info) { toast("info", "Informasi prototipe", info.dataset.toastInfo); return; }
  }

  function onSubmit(e) {
    if (e.target.id === "calcForm") {
      e.preventDefault();
      readCalcValues(); updateCalcResult();
      toast("success", "Simulasi diperbarui", "Angka dihitung ulang di browser Anda.");
    }
    if (e.target.id === "statusForm") {
      e.preventDefault();
      checkStatusCode($("#statusCode") ? $("#statusCode").value : "");
    }
    if (e.target.id === "wizardForm") {
      e.preventDefault();
      advanceWizard();
    }
    if (e.target.id === "consultationForm") {
      e.preventDefault();
      submitConsultation(e.target);
    }
    if (e.target.id === "contentForm") {
      e.preventDefault();
      submitContent(e.target);
    }
    if (e.target.id === "bookingForm") {
      e.preventDefault();
      submitBooking(e.target);
    }
    if (e.target.id === "providerForm") {
      e.preventDefault();
      submitProvider(e.target);
    }
    if (e.target.id === "trainingForm") {
      e.preventDefault();
      submitTraining(e.target);
    }
    if (e.target.id === "appointmentForm") {
      e.preventDefault();
      submitAppointment(e.target);
    }
  }

  const debouncedEdu = debounce(() => { renderEduFilters(); renderArticleResults(); }, 120);
  const debouncedTaxSearch = debounce(() => { renderTaxpayerRows(); }, 100);
  const debouncedProvider = debounce(() => { renderProviderGrid(); }, 120);

  function onInput(e) {
    const t = e.target;
    if (t.id === "heroOmzet") {
      formatMoneyInput(t); syncHeroCalc(); return;
    }
    if (t.matches("[data-money]")) formatMoneyInput(t);
    if (t.matches("[data-calc-field]")) {
      readCalcValues(); updateCalcResult(); return;
    }
    if (t.id === "eduSearch") {
      state.eduSearch = t.value;
      debouncedEdu();
      return;
    }
    if (t.id === "providerSearch") {
      state.providerSearch = t.value;
      debouncedProvider();
      return;
    }
    if (t.id === "shareValue") {
      formatMoneyInput(t);
      updateShareResult();
      return;
    }
    if (t.id === "certName") {
      const out = $("#certNameOut");
      if (out) out.textContent = t.value || "Peserta PESONA";
      return;
    }
    if (t.id === "bookQty") {
      updateBookingSummary();
      return;
    }
    if (t.id === "adminTaxSearch") {
      state.adminTaxSearch = t.value;
      debouncedTaxSearch();
      return;
    }
    if (t.id === "globalSearch") {
      renderSearch(t.value);
      return;
    }
    if (t.id === "lBase" || t.id === "lRate") {
      if (state.wizard) {
        state.wizard.data.base = $("#lBase") ? $("#lBase").value : "";
        state.wizard.data.rate = $("#lRate") ? num($("#lRate").value) : 0;
        const preview = $("#wizardTaxPreview");
        if (preview) preview.textContent = rp(num(state.wizard.data.base) * num(state.wizard.data.rate) / 100);
      }
    }
  }

  function onChange(e) {
    const t = e.target;
    if (t.closest("#docChecklist")) { updateDocProgress(); return; }
    if (t.id === "adminTaxStatus") { state.adminTaxStatus = t.value; renderTaxpayerRows(); return; }
    if (t.id === "adminTaxType") { state.adminTaxType = t.value; renderTaxpayerRows(); return; }
    if (t.id === "providerArea") { state.providerArea = t.value; renderProviderGrid(); return; }
    if (t.id === "lTax" && state.wizard) {
      state.wizard.data.tax = t.value;
      state.wizard.data.rate = taxRateDefaults[t.value] != null ? taxRateDefaults[t.value] : 10;
      return;
    }
    if (t.matches("[data-upload]") && state.wizard) {
      const file = t.files && t.files[0];
      if (file) {
        state.wizard.data.files = state.wizard.data.files || {};
        state.wizard.data.files[t.dataset.upload] = file.name;
        renderWizard();
      }
      return;
    }
    if (t.matches("[data-calc-field]")) { readCalcValues(); updateCalcResult(); }
    if (t.id === "lBase" || t.id === "lRate") {
      const preview = $("#wizardTaxPreview");
      if (preview && state.wizard) {
        state.wizard.data.base = $("#lBase") ? $("#lBase").value : "";
        state.wizard.data.rate = num($("#lRate") ? $("#lRate").value : 0);
        preview.textContent = rp(num(state.wizard.data.base) * num(state.wizard.data.rate) / 100);
      }
    }
  }

  function onKeydown(e) {
    const searchDialog = $("#searchDialog");
    if (searchDialog && searchDialog.open) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        state.searchIndex = Math.min(state.searchResults.length - 1, state.searchIndex + 1);
        updateSearchSelection();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        state.searchIndex = Math.max(0, state.searchIndex - 1);
        updateSearchSelection();
      } else if (e.key === "Enter") {
        e.preventDefault();
        chooseSearchResult(state.searchIndex);
      } else if (e.key === "Escape") {
        closeSearch();
      }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === "k") {
      e.preventDefault();
      if (!dialog.open) openSearch();
      return;
    }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if (e.key === "/" && !typing && !dialog.open) {
      e.preventDefault(); openSearch(); return;
    }
    if (e.key === "Escape") { closeNotif(); closeMobileNav(); }
  }

  function init() {
    const qTheme = new URLSearchParams(location.search).get("theme");
    applyTheme(qTheme === "dark" || qTheme === "light" ? qTheme : state.theme);
    setupHeaderSentinel();
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    document.addEventListener("keydown", onKeydown);

    if (dialog) {
      dialog.addEventListener("close", onDialogClosed);
      dialog.addEventListener("click", (e) => { if (e.target === dialog) closeDialog(); });
    }
    const sd = $("#searchDialog");
    if (sd) {
      sd.addEventListener("click", (e) => { if (e.target === sd) closeSearch(); });
      sd.addEventListener("close", () => { if (!dialog.open) document.body.classList.remove("modal-open"); });
    }

    const dateEl = $("#adminDate");
    if (dateEl) dateEl.textContent = fmtLongDate(new Date());
    renderNotifications();
    updateAuthUI();
    updateProviderCount();
    if (state.account) {
      // akun demo tersimpan dari sesi sebelumnya
    }

    if (!location.hash) history.replaceState(null, "", "#/beranda");
    onRoute();
    window.addEventListener("hashchange", onRoute);
  }

  init();
})();


