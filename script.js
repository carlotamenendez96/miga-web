/* ============================================================
   MIGA · script.js
   Menú de migas · hero · scroll reveal · analítica · formularios
   ============================================================ */
(function () {
  "use strict";

  /* ===== Google Tag Manager (inyección) — MIGA ===== */
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WLTHWCL5');

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Analítica (GA4 vía dataLayer / GTM) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(evento, params) {
    window.dataLayer.push(Object.assign({ event: evento }, params || {}));
    // Para depurar en clase: descomentar
    // console.log("[GA4]", evento, params || {});
  }
  window.migaTrack = track;

  // Eventos automáticos por atributo data-evento
  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-evento]");
    if (el) track(el.dataset.evento, { etiqueta: el.dataset.etiqueta || el.textContent.trim().slice(0, 60) });
  });

  // Vista de página con nombre propio
  const nombrePagina = document.body.dataset.pagina;
  if (nombrePagina) track("view_" + nombrePagina);

  // Envío confirmado (página de gracias) — señal fiable para la conversión
  (function () {
    const ruta = (location.pathname || "").toLowerCase();
    if (ruta.indexOf("gracias-migacolab") !== -1) track("submit_ok_migacolab");
    else if (ruta.indexOf("gracias-migainfluencer") !== -1) track("submit_ok_migainfluencer");
  })();

  // Scroll 75%
  let scroll75 = false;
  window.addEventListener("scroll", function () {
    if (scroll75) return;
    const p = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
    if (p >= 0.75) { scroll75 = true; track("scroll_75", { pagina: nombrePagina }); }
  }, { passive: true });

  /* ---------- Header con fondo al hacer scroll ---------- */
  const cabecera = document.querySelector(".cabecera");
  if (cabecera) {
    const alScroll = () => cabecera.classList.toggle("con-fondo", window.scrollY > 24);
    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();
  }

  /* ---------- Menú de migas ---------- */
  const btnMenu = document.querySelector(".btn-migas");
  const overlay = document.querySelector(".menu-overlay");
  if (btnMenu && overlay) {
    let abierto = false;
    function alternarMenu(forzar) {
      abierto = typeof forzar === "boolean" ? forzar : !abierto;
      overlay.classList.toggle("abierto", abierto);
      btnMenu.setAttribute("aria-expanded", String(abierto));
      btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = abierto ? "hidden" : "";
      if (abierto) { track("click_menu"); overlay.querySelector("a").focus(); }
    }
    btnMenu.addEventListener("click", () => alternarMenu());
    overlay.addEventListener("click", (e) => { if (e.target.closest("a")) alternarMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && abierto) { alternarMenu(false); btnMenu.focus(); } });
  }

  /* ---------- Scroll reveal ---------- */
  const reveladas = document.querySelectorAll(".revela");
  if (reveladas.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visto"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveladas.forEach((el) => io.observe(el));
  } else {
    reveladas.forEach((el) => el.classList.add("visto"));
  }

  /* ---------- Migas flotantes ambientales ---------- */
  document.querySelectorAll("[data-migas-flotantes]").forEach(function (zona) {
    if (reduceMotion) return;
    const n = parseInt(zona.dataset.migasFlotantes, 10) || 10;
    for (let i = 0; i < n; i++) {
      const m = document.createElement("span");
      m.className = "miga-flotante" + (i % 3 === 1 ? " tostada" : i % 3 === 2 ? " oscura" : "");
      const s = 4 + Math.random() * 8;
      m.style.width = s + "px";
      m.style.height = s * (0.7 + Math.random() * 0.5) + "px";
      m.style.left = Math.random() * 100 + "%";
      m.style.top = Math.random() * 100 + "%";
      m.style.animationDelay = -(Math.random() * 9) + "s";
      m.style.animationDuration = 7 + Math.random() * 6 + "s";
      m.setAttribute("aria-hidden", "true");
      zona.appendChild(m);
    }
  });

  /* ---------- Hero inicio: logo desde migas (una vez por sesión) ---------- */
  (function () {
    const hero = document.querySelector(".hero-home");
    if (!hero) return;

    const stage = hero.querySelector(".hero-crumb-stage");
    const skipBtn = hero.querySelector(".hero-anim-skip");
    const SESSION_KEY = "miga_hero_anim_visto";
    const DURACION = 1500;
    let terminado = false;
    let temporizador = null;

    function finalizarAnimacion() {
      if (terminado) return;
      terminado = true;
      if (temporizador) clearTimeout(temporizador);
      hero.classList.remove("hero-anim-playing");
      hero.classList.add("hero-anim-done");
      if (stage) stage.replaceChildren();
      if (skipBtn) skipBtn.hidden = true;
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* privado */ }
    }

    if (reduceMotion || sessionStorage.getItem(SESSION_KEY)) {
      hero.classList.add("hero-anim-static", "hero-anim-done");
      return;
    }

    if (!stage) {
      hero.classList.add("hero-anim-static", "hero-anim-done");
      return;
    }

    const migas = 22;
    for (let i = 0; i < migas; i++) {
      const m = document.createElement("span");
      m.className = "hero-crumb" + (i % 3 === 1 ? " tostada" : i % 3 === 2 ? " oscura" : "");
      const s = 5 + Math.random() * 9;
      m.style.width = s + "px";
      m.style.height = s * (0.65 + Math.random() * 0.45) + "px";
      const angulo = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 95;
      m.style.setProperty("--ox", (Math.cos(angulo) * dist).toFixed(1) + "px");
      m.style.setProperty("--oy", (Math.sin(angulo) * dist).toFixed(1) + "px");
      m.style.setProperty("--rot", (Math.random() * 240 - 120).toFixed(1) + "deg");
      m.style.animationDelay = (Math.random() * 0.22).toFixed(2) + "s";
      stage.appendChild(m);
    }

    hero.classList.add("hero-anim-playing");
    if (skipBtn) {
      skipBtn.hidden = false;
      skipBtn.addEventListener("click", finalizarAnimacion);
    }
    temporizador = setTimeout(finalizarAnimacion, DURACION);
  })();

  /* ---------- Migas que saltan de los botones ---------- */
  if (!reduceMotion) {
    document.querySelectorAll(".btn, .miga-slice-btn").forEach(function (btn) {
      btn.addEventListener("mouseenter", function () {
        for (let i = 0; i < 5; i++) {
          const m = document.createElement("span");
          m.className = "miga-salta";
          m.setAttribute("aria-hidden", "true");
          m.style.left = 20 + Math.random() * 60 + "%";
          m.style.top = "40%";
          btn.appendChild(m);
          const dx = (Math.random() - 0.5) * 70;
          const dy = -(25 + Math.random() * 45);
          m.animate([
            { transform: "translate(0,0) rotate(0)", opacity: 1 },
            { transform: "translate(" + dx + "px," + dy + "px) rotate(" + (Math.random() * 200 - 100) + "deg)", opacity: 0 }
          ], { duration: 550 + Math.random() * 250, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => m.remove();
        }
      });
    });
  }

  /* ---------- Formularios multipaso (flujo guiado) ---------- */
  document.querySelectorAll("form[data-form-flujo]").forEach(function (form) {
    initFormFlujo(form);
  });

  function initFormFlujo(form) {
    var pasos = Array.from(form.querySelectorAll(".form-flujo__paso"));
    if (!pasos.length) return;

    var nombreForm = form.dataset.form;
    var storageKey = "miga_flujo_" + nombreForm;
    var crumbBar = form.querySelector(".miga-crumb-bar");
    var migas = crumbBar ? Array.from(crumbBar.querySelectorAll(".miga-crumb-bar__miga")) : [];
    var totalMigas = migas.length || 12;
    var pasoActual = 0;
    var empezado = false;
    var btnAtras = form.querySelector(".form-flujo__atras");
    var btnContinuar = form.querySelector(".form-flujo__continuar");
    var textoActual = form.querySelector(".miga-crumb-bar__actual");
    var textoTotal = form.querySelector(".miga-crumb-bar__total");
    var autoTimer = null;

    function esPasoBienvenida(paso) {
      return paso.dataset.pasoTipo === "bienvenida";
    }

    function esPasoRevision(paso) {
      return paso.dataset.pasoTipo === "revision";
    }

    function pasoOpcional(paso) {
      return paso.hasAttribute("data-opcional");
    }

    function evaluarCondicional(paso) {
      var regla = paso.dataset.condicional;
      if (!regla) return true;
      var sep = regla.indexOf(":");
      if (sep === -1) return true;
      var name = regla.slice(0, sep);
      var valor = regla.slice(sep + 1);
      return !!form.querySelector('input[name="' + name + '"][value="' + valor + '"]:checked');
    }

    function pasoVisible(paso) {
      if (paso.hasAttribute("hidden")) return false;
      return evaluarCondicional(paso);
    }

    function pasosContables() {
      return pasos.filter(function (p) { return !esPasoBienvenida(p) && pasoVisible(p); });
    }

    function indiceProgreso(index) {
      var contables = pasosContables();
      var paso = pasos[index];
      if (!paso || esPasoBienvenida(paso)) return { actual: 0, total: contables.length };
      var visiblesHasta = pasos.slice(0, index + 1).filter(function (p) {
        return !esPasoBienvenida(p) && pasoVisible(p);
      }).length;
      return { actual: visiblesHasta, total: contables.length };
    }

    function siguienteIndice(desde) {
      for (var i = desde + 1; i < pasos.length; i++) {
        if (pasoVisible(pasos[i])) return i;
      }
      return -1;
    }

    function anteriorIndice(desde) {
      for (var i = desde - 1; i >= 0; i--) {
        if (pasoVisible(pasos[i])) return i;
      }
      return -1;
    }

    function validarTelefono(valor) {
      var digitos = String(valor || "").replace(/\D/g, "");
      return digitos.length >= 9 && digitos.length <= 15;
    }

    function trackForm(evento) {
      track(evento, { formulario: nombreForm, paso: pasoActual + 1 });
    }

    function guardarSesion() {
      try {
        var datos = {};
        Array.from(new FormData(form).entries()).forEach(function (par) {
          var clave = par[0];
          var valor = par[1];
          if (clave === "bot-field" || clave === "form-name") return;
          if (datos[clave]) {
            if (!Array.isArray(datos[clave])) datos[clave] = [datos[clave]];
            datos[clave].push(valor);
          } else {
            datos[clave] = valor;
          }
        });
        datos.__paso = pasoActual;
        sessionStorage.setItem(storageKey, JSON.stringify(datos));
      } catch (err) { /* privado */ }
    }

    function restaurarSesion() {
      try {
        var raw = sessionStorage.getItem(storageKey);
        if (!raw) return;
        var datos = JSON.parse(raw);
        Object.keys(datos).forEach(function (clave) {
          if (clave.indexOf("__") === 0) return;
          var valor = datos[clave];
          var campos = form.querySelectorAll('[name="' + clave + '"]');
          if (!campos.length) return;
          if (campos[0].type === "checkbox" || campos[0].type === "radio") {
            var valores = Array.isArray(valor) ? valor : [valor];
            campos.forEach(function (c) {
              c.checked = valores.indexOf(c.value) !== -1;
            });
          } else if (campos[0].tagName === "SELECT") {
            campos[0].value = valor;
          } else {
            campos[0].value = valor;
          }
        });
        if (typeof datos.__paso === "number" && datos.__paso >= 0 && datos.__paso < pasos.length) {
          pasoActual = datos.__paso;
          if (!pasoVisible(pasos[pasoActual])) {
            var alt = siguienteIndice(pasoActual - 1);
            if (alt !== -1) pasoActual = alt;
          }
        }
      } catch (err) { /* corrupto */ }
    }

    function valorProgreso() {
      var prog = indiceProgreso(pasoActual);
      if (!prog.actual) return 0;
      return Math.max(1, Math.round((prog.actual / prog.total) * totalMigas));
    }

    function actualizarProgreso() {
      var paso = pasos[pasoActual];
      var enBienvenida = esPasoBienvenida(paso);
      form.classList.toggle("form-flujo--sin-progreso", enBienvenida);
      var prog = indiceProgreso(pasoActual);
      if (textoActual) textoActual.textContent = enBienvenida ? "0" : String(prog.actual);
      if (textoTotal) textoTotal.textContent = String(prog.total);
      var valor = valorProgreso();
      var esFinal = esPasoRevision(paso);
      if (crumbBar) {
        crumbBar.setAttribute("aria-valuenow", String(valor));
        crumbBar.setAttribute("aria-valuemax", String(totalMigas));
      }
      migas.forEach(function (miga, i) {
        miga.classList.remove("miga-crumb-bar__miga--hecho", "miga-crumb-bar__miga--actual");
        if (enBienvenida) return;
        if (esFinal || i < valor - 1) {
          miga.classList.add("miga-crumb-bar__miga--hecho");
        } else if (i === valor - 1) {
          miga.classList.add("miga-crumb-bar__miga--actual");
        }
      });
    }

    function validarPaso(index) {
      var paso = pasos[index];
      if (!pasoVisible(paso)) return true;
      var valido = true;
      paso.classList.remove("form-flujo__paso--invalido");

      paso.querySelectorAll(".campo").forEach(function (campo) {
        if (campo.closest("[data-condicional-inline]") && campo.closest("[data-condicional-inline]").hidden) return;
        campo.classList.remove("error");
        var control = campo.querySelector("input,select,textarea");
        if (!control) return;
        if (pasoOpcional(paso) && !String(control.value || "").trim()) return;
        var obligatorio = control.hasAttribute("required");
        var ok = true;
        if (obligatorio && !String(control.value || "").trim()) ok = false;
        if (control.type === "email" && control.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value)) ok = false;
        if (control.type === "tel" && control.value && !validarTelefono(control.value)) ok = false;
        if (control.type === "url" && control.value && !/^https?:\/\/.+/i.test(control.value)) ok = false;
        if (control.type === "url" && pasoOpcional(paso) && !control.value.trim()) ok = true;
        if (control.type === "number" && control.value) {
          var num = Number(control.value);
          if (control.min && num < Number(control.min)) ok = false;
          if (control.max && num > Number(control.max)) ok = false;
        }
        campo.classList.toggle("error", !ok);
        if (!ok) valido = false;
      });

      paso.querySelectorAll("fieldset[data-requiere-al-menos-uno]").forEach(function (fs) {
        var checks = fs.querySelectorAll('input[type="checkbox"]');
        var alguno = Array.from(checks).some(function (c) { return c.checked; });
        if (!alguno) valido = false;
      });

      var radiosReq = paso.querySelectorAll('fieldset[data-requiere-radio] input[type="radio"]');
      if (radiosReq.length) {
        var nombre = radiosReq[0].name;
        if (!form.querySelector('input[name="' + nombre + '"]:checked')) valido = false;
      }

      var selectReq = paso.querySelector("select[required]");
      if (selectReq && !selectReq.value) valido = false;

      if (esPasoRevision(paso)) {
        var consent = paso.querySelector('.consentimiento input[type="checkbox"]');
        if (consent && !consent.checked) {
          valido = false;
          consent.closest(".consentimiento").style.outline = "2px solid #B0301E";
        } else if (consent) {
          consent.closest(".consentimiento").style.outline = "";
        }
      }

      if (!valido) paso.classList.add("form-flujo__paso--invalido");
      return valido;
    }

    function construirRevision() {
      var contenedor = form.querySelector(".form-flujo__revision");
      if (!contenedor) return;
      var dl = document.createElement("dl");
      pasos.forEach(function (paso) {
        if (esPasoRevision(paso) || esPasoBienvenida(paso) || !pasoVisible(paso)) return;
        var titulo = paso.dataset.pregunta;
        if (!titulo) return;
        var respuesta = obtenerRespuestaPaso(paso);
        if (!respuesta) return;
        var dt = document.createElement("dt");
        dt.textContent = titulo;
        var dd = document.createElement("dd");
        dd.textContent = respuesta;
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      contenedor.replaceChildren(dl);
    }

    function obtenerRespuestaPaso(paso) {
      var partes = [];
      paso.querySelectorAll("input,select,textarea").forEach(function (el) {
        if (el.type === "hidden" || el.name === "bot-field") return;
        if (el.closest("[data-condicional-inline]") && el.closest("[data-condicional-inline]").hidden) return;
        if (el.type === "checkbox" || el.type === "radio") {
          if (!el.checked) return;
          var label = el.closest(".opcion");
          partes.push(label ? label.querySelector("span").textContent.trim() : el.value);
        } else if (el.tagName === "SELECT") {
          if (el.value) partes.push(el.value);
        } else if (String(el.value || "").trim()) {
          partes.push(el.value.trim());
        }
      });
      return partes.join(", ");
    }

    function actualizarCondicionalesInline() {
      form.querySelectorAll("[data-condicional-inline]").forEach(function (bloque) {
        var regla = bloque.dataset.condicionalInline;
        if (!regla) return;
        var sep = regla.indexOf(":");
        var name = regla.slice(0, sep);
        var valor = regla.slice(sep + 1);
        var activo = !!form.querySelector('input[name="' + name + '"][value="' + valor + '"]:checked');
        bloque.hidden = !activo;
        bloque.querySelectorAll("input,textarea,select").forEach(function (el) {
          if (activo) el.setAttribute("required", "");
          else el.removeAttribute("required");
        });
      });
    }

    function mostrarPaso(index, direccion) {
      pasoActual = index;
      actualizarCondicionalesInline();
      pasos.forEach(function (paso, i) {
        paso.classList.remove("form-flujo__paso--activo", "form-flujo__paso--atras");
        if (i === index) {
          paso.classList.add("form-flujo__paso--activo");
          if (direccion === "atras") paso.classList.add("form-flujo__paso--atras");
        }
      });

      if (esPasoRevision(pasos[index])) construirRevision();

      var enBienvenida = esPasoBienvenida(pasos[index]);
      if (btnAtras) btnAtras.hidden = enBienvenida || anteriorIndice(index) === -1;

      if (btnContinuar) {
        var esRev = esPasoRevision(pasos[index]);
        btnContinuar.type = esRev ? "submit" : "button";
        if (enBienvenida) {
          btnContinuar.textContent = "Empezar";
        } else if (esRev) {
          btnContinuar.textContent = form.dataset.textoEnviar || "Enviar";
        } else if (pasos[index].hasAttribute("data-saltar")) {
          btnContinuar.textContent = "No tengo / Saltar";
        } else if (pasoOpcional(pasos[index])) {
          btnContinuar.textContent = "Continuar (opcional)";
        } else {
          btnContinuar.textContent = "Continuar";
        }
        btnContinuar.hidden = false;
      }

      actualizarProgreso();
      guardarSesion();

      if (!enBienvenida) {
        var foco = pasos[index].querySelector("input:not([type=hidden]):not([type=radio]):not([type=checkbox]),select,textarea");
        if (foco) foco.focus({ preventScroll: true });
      }

      form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }

    function avanzar() {
      if (esPasoBienvenida(pasos[pasoActual])) {
        if (!empezado) { empezado = true; trackForm("start_form_" + nombreForm); }
        var sig = siguienteIndice(pasoActual);
        if (sig !== -1) mostrarPaso(sig, "adelante");
        return;
      }
      if (!validarPaso(pasoActual)) return;
      if (!empezado) { empezado = true; trackForm("start_form_" + nombreForm); }
      var next = siguienteIndice(pasoActual);
      if (next !== -1) mostrarPaso(next, "adelante");
    }

    function retroceder() {
      var prev = anteriorIndice(pasoActual);
      if (prev !== -1) mostrarPaso(prev, "atras");
    }

    function programarAutoAvance() {
      if (autoTimer) clearTimeout(autoTimer);
      autoTimer = setTimeout(function () {
        actualizarCondicionalesInline();
        if (validarPaso(pasoActual)) avanzar();
      }, 420);
    }

    restaurarSesion();
    actualizarCondicionalesInline();
    mostrarPaso(pasoActual, "adelante");

    form.addEventListener("input", function () {
      if (!empezado && !esPasoBienvenida(pasos[pasoActual])) {
        empezado = true;
        trackForm("start_form_" + nombreForm);
      }
      actualizarCondicionalesInline();
      guardarSesion();
    });

    form.addEventListener("change", function (e) {
      actualizarCondicionalesInline();
      guardarSesion();
      var paso = pasos[pasoActual];
      if (!paso.contains(e.target)) return;
      if (e.target.dataset && e.target.dataset.cita) {
        track("select_meeting_" + e.target.dataset.cita);
      }
      if (paso.dataset.autoAvanzar === "true" && (e.target.type === "radio" || e.target.tagName === "SELECT")) {
        programarAutoAvance();
      }
    });

    if (btnContinuar) {
      btnContinuar.addEventListener("click", function (e) {
        if (btnContinuar.type === "button") {
          e.preventDefault();
          avanzar();
        }
      });
    }

    if (btnAtras) btnAtras.addEventListener("click", retroceder);

    form.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey) return;
      var paso = pasos[pasoActual];
      if (esPasoRevision(paso) || esPasoBienvenida(paso)) return;
      if (e.target.tagName === "TEXTAREA") return;
      if (paso.querySelector('input[type="checkbox"],input[type="radio"]') && e.target.type !== "text" && e.target.type !== "email" && e.target.type !== "tel" && e.target.type !== "url" && e.target.type !== "number") return;
      e.preventDefault();
      avanzar();
    });

    form.addEventListener("submit", function (e) {
      if (!esPasoRevision(pasos[pasoActual])) {
        e.preventDefault();
        return;
      }
      if (!validarPaso(pasoActual)) {
        e.preventDefault();
        return;
      }
      for (var i = 0; i < pasos.length; i++) {
        if (!pasoVisible(pasos[i]) || esPasoBienvenida(pasos[i])) continue;
        if (!validarPaso(i)) {
          e.preventDefault();
          mostrarPaso(i, "atras");
          return;
        }
      }
      trackForm("submit_form_" + nombreForm);

      if (nombreForm === "migacolab") {
        var citaRadio = form.querySelector('input[name="cita"]:checked');
        var baseGracias = "gracias-migacolab.html";
        if (citaRadio && citaRadio.dataset.cita) {
          try { sessionStorage.setItem("miga_cita_pendiente", citaRadio.dataset.cita); } catch (err) { /* */ }
          form.action = baseGracias + "?cita=" + encodeURIComponent(citaRadio.dataset.cita);
        } else {
          try { sessionStorage.removeItem("miga_cita_pendiente"); } catch (err) { /* */ }
          form.action = baseGracias;
        }
      }

      try { sessionStorage.removeItem(storageKey); } catch (err) { /* */ }
    });
  }

  /* ---------- Formularios: validación + eventos (formularios clásicos) ---------- */
  document.querySelectorAll("form[data-form]:not([data-form-flujo])").forEach(function (form) {
    const nombreForm = form.dataset.form; // migainfluencer | migacolab
    let empezado = false;

    form.addEventListener("input", function () {
      if (!empezado) { empezado = true; track("start_form_" + nombreForm); }
    }, { once: false });

    form.addEventListener("submit", function (e) {
      let valido = true;
      form.querySelectorAll(".campo").forEach(function (campo) {
        const control = campo.querySelector("input,select,textarea");
        if (!control) return;
        const obligatorio = control.hasAttribute("required");
        let ok = true;
        if (obligatorio && !control.value.trim()) ok = false;
        if (control.type === "email" && control.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value)) ok = false;
        campo.classList.toggle("error", !ok);
        if (!ok) valido = false;
      });
      // Checkbox de consentimiento
      const consent = form.querySelector(".consentimiento input[type=checkbox]");
      if (consent && !consent.checked) {
        valido = false;
        consent.closest(".consentimiento").style.outline = "2px solid #B0301E";
      } else if (consent) {
        consent.closest(".consentimiento").style.outline = "";
      }
      if (!valido) {
        e.preventDefault();
        const primerError = form.querySelector(".campo.error input, .campo.error select, .campo.error textarea");
        if (primerError) primerError.focus();
        return;
      }
      track("submit_form_" + nombreForm);
    });
  });

  /* ---------- Gracias MigaColab: agenda Cal.com tras cita ---------- */
  (function () {
    if (document.body.dataset.pagina !== "gracias_migacolab") return;

    var calMap = {
      presencial: { link: "somosmiga/un-cafe-con-miga", ns: "un-cafe-con-miga", label: "Elegir fecha — cita presencial" },
      telefonica: { link: "somosmiga/llamada-con-miga", ns: "llamada-con-miga", label: "Elegir fecha — llamada telefónica" },
      videollamada: { link: "somosmiga/videollamada-miga", ns: "videollamada-miga", label: "Elegir fecha — videollamada" }
    };

    var params = new URLSearchParams(location.search);
    var cita = params.get("cita");
    try {
      if (!cita) cita = sessionStorage.getItem("miga_cita_pendiente");
    } catch (err) { /* */ }
    if (!cita || !calMap[cita]) return;

    var bloque = document.getElementById("gracias-cita-cal");
    var btn = document.getElementById("btn-abrir-cal");
    if (!bloque || !btn) return;

    var cfg = calMap[cita];
    btn.textContent = cfg.label;
    btn.setAttribute("data-cal-link", cfg.link);
    btn.setAttribute("data-cal-namespace", cfg.ns);
    bloque.hidden = false;
    track("select_meeting_" + cita, { origen: "gracias_formulario" });

    try { sessionStorage.removeItem("miga_cita_pendiente"); } catch (err) { /* */ }

    window.setTimeout(function () {
      btn.click();
    }, 900);
  })();

  /* ---------- Selector de tipo de cita (MigaColab) ---------- */
  document.querySelectorAll("[data-cita]").forEach(function (radio) {
    radio.addEventListener("change", function () {
      track("select_meeting_" + radio.dataset.cita);
    });
  });
})();
