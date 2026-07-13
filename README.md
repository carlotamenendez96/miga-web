# MIGA · somosmiga.es

Web completa de captación para MIGA: creadores (MigaInfluencer) y negocios (MigaColab).
HTML + CSS + JS puro, lista para publicar en Netlify.

## Estructura

```
miga-web/
├── index.html                  Inicio (hero animado con vídeo + logo)
├── sobre-nosotras.html         Lucía y Carlota
├── planes.html                 Planes de lanzamiento + puntuales
├── migacolab.html              Página negocios + formulario + cita
├── migainfluencer.html         Página creadores + formulario
├── contacto.html               Contacto
├── gracias-migacolab.html      Gracias negocios (noindex)
├── gracias-migainfluencer.html Gracias creadores (noindex)
├── privacidad.html             Política básica
├── styles.css                  Sistema de diseño MIGA
├── script.js                   Menú, animaciones, analítica, validación
├── assets/
│   ├── logo-miga.jpg           Logo (foto optimizada, fondo fundido)
│   ├── hero-logo.mp4           Vídeo del hero (sin audio)
│   ├── og-miga.jpg             Imagen para compartir en redes (1200×630)
│   └── favicon.png             Favicon placeholder
├── README.md
└── CRO-MICROCREDENCIAL.md      Documento para defender el proyecto
```

## 1. Publicar en Netlify (5 minutos)

1. Entra en https://app.netlify.com y crea cuenta (con Google vale).
2. En el panel: **Add new site → Deploy manually**.
3. Arrastra la carpeta `miga-web` completa a la zona de subida.
4. Netlify te da una URL tipo `https://algo-aleatorio.netlify.app`. Ya está online.
5. Para actualizar: vuelve a arrastrar la carpeta (Deploys → drag & drop).

Alternativa recomendada a medio plazo: subir la carpeta a un repositorio de GitHub
y conectar el repo en Netlify (**Add new site → Import from Git**). Así cada cambio
que subáis Carlota o tú se publica solo.

## 2. Conectar el dominio somosmiga.es

1. En Netlify: **Site configuration → Domain management → Add a domain** → escribe `somosmiga.es`.
2. Netlify te dará 4 servidores DNS (tipo `dns1.p03.nsone.net`).
3. En el panel de tu registrador (donde compraste el dominio), cambia los
   **nameservers** por esos 4.
4. Añade también `www.somosmiga.es` y `somosmiga.com` como alias (redirigen al principal).
5. Espera 1–24 h a que propague. Netlify activa el HTTPS (Let's Encrypt) solo.

## 3. Activar los formularios en Netlify

Los dos formularios ya llevan todo lo necesario (`data-netlify="true"`, campo oculto
`form-name`, honeypot antispam `bot-field` y redirección a las páginas de gracias vía `action`).

1. Tras el primer deploy, ve a **Forms** en el panel de Netlify: verás `migacolab` y `migainfluencer`.
2. Haz un envío de prueba desde la web publicada (en local no funcionan).
3. **Forms → Form notifications → Add notification → Email** → pon `hola@somosmiga.es`.
   Recibiréis cada envío por correo automáticamente.
4. Exportar CSV: dentro de cada formulario, botón **Export to CSV**.

Plan gratuito: 100 envíos/mes. Suficiente para la fase de validación.

## 4. Conectar formularios con Google Sheets o Airtable

Opción A — Zapier (más fácil):
1. Crea cuenta en zapier.com.
2. Zap 1: Trigger **Netlify → New form submission** (formulario `migainfluencer`)
   → Action **Google Sheets → Create spreadsheet row** (o **Airtable → Create record**).
3. Zap 2: igual con `migacolab`.
4. Mapea cada campo del formulario a su columna (ver esquema de tablas abajo).

Opción B — Make.com (más barato, mismo concepto): módulo Netlify → módulo Airtable.

Esquema recomendado (coincide con los `name` de los formularios):

**Tabla Creadores**: id, fecha_registro, nombre, edad, ciudad, email, whatsapp, instagram,
tiktok, otras_redes, seguidores, nicho, tipo_contenido, experiencia_colabs, interes_colabs,
zonas, como_recomiendas, link_contenido, estado, notas, consentimiento

**Tabla Negocios**: id, fecha_registro, negocio, tipo_negocio, ciudad, barrio, contacto,
cargo, email, whatsapp, instagram, web, objetivo, tipo_colaboracion, presupuesto, cita,
preferencia_horario, mensaje, estado, notas, consentimiento

(`estado` y `notas` los rellenáis vosotras en Airtable: Nuevo → Contactado → Reunión → Alta → Descartado.)

## 5. Integrar Calendly / Cal.com

1. Crea cuenta en calendly.com (o cal.com, gratuito y open source).
2. Crea 3 tipos de evento: **Cita presencial (30 min)**, **Llamada (15 min)**, **Videollamada (20 min)**.
3. Copia el enlace de cada evento.
4. En `migacolab.html`, busca `TODO: insertar enlace real de Calendly` (sección `#cita`)
   y sustituye los tres `href="#"` por los enlaces reales.
5. Extra opcional: en Calendly → evento → **Confirmations**, redirige a
   `https://somosmiga.es/gracias-migacolab.html` para medir también esa conversión.

## 6. Añadir GA4 + GTM

1. Crea la propiedad GA4 en analytics.google.com → apunta el **Measurement ID** (G-XXXX).
2. Crea contenedor en tagmanager.google.com → apunta el **ID GTM-XXXXXXX**.
3. En **todas** las páginas hay un bloque comentado `<!-- TODO: insertar GTM -->` en el `<head>`:
   descomenta el de `index.html`, pon tu ID, y copia ese mismo bloque al resto de páginas.
4. En GTM: crea etiqueta **Google Analytics: GA4 Configuration** con tu Measurement ID,
   activador "All Pages".
5. Los eventos ya se envían solos al `dataLayer` desde `script.js`. En GTM crea una
   etiqueta **GA4 Event** con activador de tipo **Custom Event** usando `.*` (regex) para
   reenviar todos, o crea activadores individuales para los eventos clave.
6. En GA4 → Admin → Events → marca como **conversión**:
   `submit_form_migacolab`, `submit_form_migainfluencer`, `click_book_meeting`.

Eventos implementados: view_home, view_pricing, view_migacolab, view_migainfluencer,
view_contacto, view_sobre_nosotras, click_cta_migainfluencer, click_cta_migacolab,
start_form_migainfluencer, submit_form_migainfluencer, start_form_migacolab,
submit_form_migacolab, click_book_meeting, select_meeting_presencial,
select_meeting_telefonica, select_meeting_videollamada, click_whatsapp, click_instagram,
click_email, click_plan_descubre, click_plan_local, click_plan_crecimiento,
click_plan_multilocal, click_menu, scroll_75.

Si añadís GA4/GTM en producción, activad también un banner de cookies
(p. ej. CookieYes o Cookiebot gratuito) — ya está avisado en privacidad.html.

## 7. TODOs pendientes antes de entregar

- [ ] TODO: insertar enlaces reales de Calendly/Cal.com (migacolab.html, sección #cita)
- [ ] TODO: insertar ID de GTM y descomentar el snippet en todas las páginas
- [ ] TODO: sustituir favicon placeholder por el definitivo si queréis otro recorte
- [ ] TODO: confirmar política legal definitiva con asesoría antes del lanzamiento comercial
- [ ] TODO: si generáis un vídeo final del logo mejor, sustituir assets/hero-logo.mp4 (mismo nombre y listo)

## 8. Checklist final

**UX**
- [x] Se entiende qué es MIGA en <10 segundos (hero: titular + subtítulo + 2 CTAs)
- [x] Dos rutas diferenciadas por color: verde creadores / corteza negocios
- [x] Objeciones respondidas en copy (secciones "Es que yo no soy influencer" y nota honesta)
- [x] Menú hamburguesa de migas con overlay accesible (Escape cierra, focus gestionado)

**CRO**
- [x] Conversión principal clara en cada página (formulario o cita)
- [x] Microconversiones: WhatsApp, Instagram, email, planes, scroll 75%
- [x] Páginas de gracias con siguiente paso (seguir, compartir, WhatsApp)
- [x] Plan gratuito destacado como puerta de entrada
- [x] Claims honestos, sin datos inventados

**Analítica**
- [x] dataLayer + eventos con nomenclatura definida
- [ ] GTM/GA4 con IDs reales (TODO)
- [ ] Conversiones marcadas en GA4 (tras crear la propiedad)

**Formularios**
- [x] Netlify Forms con honeypot y redirección a gracias
- [x] Validación en cliente con mensajes de error en español
- [x] Checkbox de consentimiento obligatorio
- [ ] Notificación a hola@somosmiga.es (se configura en Netlify tras el deploy)

**Responsive**
- [x] Mobile-first, probado a 390px y 1400px
- [x] CTAs a ancho completo en móvil, formularios a una columna

**Accesibilidad**
- [x] Skip link, focus visible, labels reales, botones reales, alt en imágenes
- [x] prefers-reduced-motion respetado (sin animaciones si el usuario lo pide)
- [x] Contraste AA en textos principales

**Legal básico**
- [x] privacidad.html enlazada desde el footer y consentimiento en formularios
- [ ] Aviso de cookies al activar GA4 (TODO)
