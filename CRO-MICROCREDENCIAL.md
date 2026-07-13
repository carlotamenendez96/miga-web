# MIGA · Documento UX/CRO para la microcredencial

## Problema que resuelve
Los negocios locales pequeños de Asturias no pueden pagar agencias ni acceder a
plataformas de influencers pensadas para grandes marcas; los creadores locales con
comunidades pequeñas pero reales no tienen forma sencilla de colaborar con ellos.
MIGA conecta ambos lados antes de que exista la app, mediante una web de captación.

## Público objetivo
1. **Creadores locales** (18–35, Gijón/Oviedo, 500–20.000 seguidores, contenido de
   gastronomía, planes y lifestyle). Objeción principal: "no soy influencer".
2. **Negocios locales** (hostelería y comercio, dueños/encargados, poco tiempo y
   presupuesto). Objeción principal: "no quiero líos ni postureo".

## Objetivo de negocio
Construir las dos bases de datos fundacionales: 50 creadores y 60 negocios
(alineado con la campaña comercial de lanzamiento en Gijón).

## Objetivo de usuario
- Creador: entender si encaja y apuntarse en menos de 3 minutos sin sentirse juzgado.
- Negocio: entender qué gana, cuánto cuesta y hablar con una persona real rápido.

## Conversiones principales
1. `submit_form_migacolab` — envío del formulario de negocios.
2. `submit_form_migainfluencer` — envío del formulario de creadores.
3. `click_book_meeting` / `select_meeting_*` — reserva de cita (negocios).

## Microconversiones
click_whatsapp · click_instagram · click_email · click_plan_* · start_form_* ·
scroll_75 · click_menu · click_cta_*

## Hipótesis CRO
- **H1**: Diferenciar los dos públicos por color y CTA desde el hero (verde/corteza)
  reduce la fricción de orientación y aumenta el CTR a las páginas de destino.
- **H2**: Responder la objeción "no soy influencer" en el propio titular de
  MigaInfluencer aumenta la tasa de inicio de formulario frente a un titular genérico.
- **H3**: Un plan de 0 € destacado como "la forma más fácil de empezar" aumenta los
  envíos de MigaColab frente a mostrar solo planes de pago.
- **H4**: Claims honestos ("proyecto en fase de validación") generan más confianza
  que prueba social inventada, medible en la tasa de rebote de la home.

## Métricas principales
- Tasa de conversión por formulario (envíos / sesiones de la página).
- Tasa de inicio→envío de formulario (start_form / submit_form): mide fricción del propio formulario.
- CTR de los dos CTAs del hero (segmentado creador/negocio).
- % de sesiones con microconversión (WhatsApp/Instagram) como señal de interés blando.

## Fricciones detectadas y decisiones tomadas
- Formularios largos → agrupación visual en 2 columnas, opciones clicables grandes,
  microcopy tranquilizador ("sin vergüenza: aquí no hay mínimo").
- Miedo al compromiso → "sin permanencia, sin letra pequeña" repetido en puntos de decisión.
- Desconfianza hacia "otra plataforma más" → página Sobre nosotras con caras, nombres
  y frase personal; tono no corporativo en todo el copy.

## Mejoras futuras
- Test A/B de titular del hero (actual vs "Gente de aquí hablando de sitios de aquí").
- Formulario de creadores en 2 pasos (datos básicos → perfil) para subir el start→submit.
- Añadir casos reales y cifras cuando existan las primeras colaboraciones.
- Página de FAQ separada si las conversaciones de WhatsApp repiten preguntas.
- Mapa de calor (Microsoft Clarity, gratuito) para validar el scroll y los CTAs.
