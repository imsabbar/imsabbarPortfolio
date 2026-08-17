# Graph Report - .  (2026-08-16)

## Corpus Check
- 134 files · ~147,665 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 691 nodes · 1790 edges · 34 communities (32 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- revalidate/route.ts / dynamic
- health/route.ts / dynamic
- CaseStudyDetailPage() / LeadFormProps
- POST() / case-studies/route.ts
- file-type / framer-motion
- dom / dom.iterable
- ClientLogosSection.tsx / ClientLogosSect
- RoiCalculator / CheckIcon
- B2BTrustBadgeProps / BookingGateModalPro
- BookingGateModal.tsx / BookingGateModal(
- not-found.tsx / dynamic
- B2BTrustBadge.tsx / B2BTrustBadge()
- icons.tsx / CodeIcon
- CaseStudyGrid.tsx / CaseStudyGrid()
- Hero.tsx / Hero()
- CheckCircleIcon / SendIcon
- [slug]/page.tsx / dynamic
- XIcon / Modal.tsx
- layout.tsx / generateStaticParams()
- About.tsx / About()
- RootLayout() / opengraph-image.tsx
- route.tsx / dynamic
- [locale]/page.tsx / HomePage()
- BrandLogo.tsx / BrandLogo()
- serviceIconMap / TechStackBanner.tsx
- CaseStudyDetail.tsx / Markdown
- CalEmbed.tsx / CalEmbed()
- ClockIcon / CpuChipIcon
- i18n / middleware.ts
- next.config.ts / calOrigins
- icon.tsx / contentType
- robots.ts / robots()
- postcss.config.mjs / config

## God Nodes (most connected - your core abstractions)
1. `Locale` - 53 edges
2. `Dictionary` - 52 edges
3. `isDbConfigured()` - 32 edges
4. `canQueryDb()` - 31 edges
5. `getLocalizedField()` - 30 edges
6. `err()` - 28 edges
7. `dbNotConfigured()` - 28 edges
8. `ok()` - 21 edges
9. `getHomePageSections()` - 20 edges
10. `trackEvent()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --indirect_call--> `sampleToPlan()`  [INFERRED]
  app/api/estimate/route.tsx → lib/sample-data.ts
- `MobileBottomBarProps` --references--> `Dictionary`  [EXTRACTED]
  components/MobileBottomBar.tsx → types/dictionary.ts
- `WhatsAppWidgetProps` --references--> `Dictionary`  [EXTRACTED]
  components/WhatsAppWidget.tsx → types/dictionary.ts
- `generateStaticParams()` --calls--> `getAllCaseStudySlugs()`  [EXTRACTED]
  app/[locale]/case-studies/[slug]/page.tsx → lib/sections/index.ts
- `generateMetadata()` --calls--> `getLocalizedField()`  [EXTRACTED]
  app/[locale]/case-studies/[slug]/page.tsx → lib/db/helpers.ts

## Import Cycles
- None detected.

## Communities (34 total, 2 thin omitted)

### Community 0 - "revalidate/route.ts / dynamic"
Cohesion: 0.05
Nodes (65): dynamic, extractBearer(), isTrustedOrigin(), isValidSecret(), parseBody(), POST(), runtime, ALLOWED_TAGS (+57 more)

### Community 1 - "health/route.ts / dynamic"
Cohesion: 0.07
Nodes (61): dynamic, GET(), runtime, dynamic, POST(), runtime, dynamic, POST() (+53 more)

### Community 2 - "CaseStudyDetailPage() / LeadFormProps"
Cohesion: 0.06
Nodes (68): CaseStudyDetailPage(), LeadFormProps, isSampleDataMode(), findAllActiveCaseStudiesCached, findFeaturedCaseStudiesCached, findAllActiveClientLogosCached, findAllContentBlocksCached, findAllActiveFaqCached (+60 more)

### Community 3 - "POST() / case-studies/route.ts"
Cohesion: 0.12
Nodes (37): POST(), dynamic, GET(), runtime, dynamic, GET(), runtime, dynamic (+29 more)

### Community 4 - "file-type / framer-motion"
Cohesion: 0.04
Nodes (48): file-type, framer-motion, mysql2, next, dependencies, file-type, framer-motion, mysql2 (+40 more)

### Community 5 - "dom / dom.iterable"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 6 - "ClientLogosSection.tsx / ClientLogosSect"
Cohesion: 0.13
Nodes (16): ClientLogosSection(), safeAssetUrl(), safeWebsiteUrl(), JsonLd(), JsonLdProps, DomainStyle, getDomainStyle(), ServicesGrid() (+8 more)

### Community 7 - "RoiCalculator / CheckIcon"
Cohesion: 0.13
Nodes (18): RoiCalculator, CheckIcon, FormValues, priceFor(), PricingMatrix(), CustomSliderProps, DEFAULT_HOURLY_RATE, ROI_SESSION_KEY (+10 more)

### Community 8 - "B2BTrustBadgeProps / BookingGateModalPro"
Cohesion: 0.19
Nodes (19): B2BTrustBadgeProps, BookingGateModalProps, CaseStudyDetailProps, CaseStudyGridProps, ClientHomeShellProps, FaqSectionProps, FooterProps, HeroProps (+11 more)

### Community 9 - "BookingGateModal.tsx / BookingGateModal("
Cohesion: 0.18
Nodes (15): BookingGateModal(), CalendarIcon, MessageCircleIcon, MobileBottomBar(), MobileBottomBarProps, phoneToDigits(), phoneToDigits(), WhatsAppWidget() (+7 more)

### Community 10 - "not-found.tsx / dynamic"
Cohesion: 0.15
Nodes (14): dynamic, LocaleNotFound(), NotFoundProps, runtime, dynamic, generateMetadata(), loadPrivacyMarkdown(), PageProps (+6 more)

### Community 11 - "B2BTrustBadge.tsx / B2BTrustBadge()"
Cohesion: 0.16
Nodes (11): B2BTrustBadge(), BookingGateModal, PdfEstimateModal, DocumentIcon, localePillLabels, SECTION_IDS, SectionId, AmbientGlowBackground() (+3 more)

### Community 12 - "icons.tsx / CodeIcon"
Cohesion: 0.12
Nodes (14): CodeIcon, IconProps, MinusIcon, MonitorIcon, MoonIcon, PlusIcon, PrinterIcon, SearchIcon (+6 more)

### Community 13 - "CaseStudyGrid.tsx / CaseStudyGrid()"
Cohesion: 0.18
Nodes (14): CaseStudyGrid(), getCaseStudyTags(), N8nFlowSimulator, resolveCaseStudyImage(), FaqSection(), BoltIcon, FileDropzone(), N8nFlowSimulator() (+6 more)

### Community 14 - "Hero.tsx / Hero()"
Cohesion: 0.20
Nodes (13): Hero(), SpecChip, DownloadIcon, resolveUrl(), SocialLinks(), SocialLinksProps, SocialProfile, CONTACT (+5 more)

### Community 15 - "CheckCircleIcon / SendIcon"
Cohesion: 0.17
Nodes (13): CheckCircleIcon, SendIcon, ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES, EMPTY_VALUES, Field(), inputClass(), isRoiEstimate() (+5 more)

### Community 16 - "[slug]/page.tsx / dynamic"
Cohesion: 0.17
Nodes (13): dynamic, generateMetadata(), generateStaticParams(), PageProps, revalidate, runtime, localizedUrl(), sitemap() (+5 more)

### Community 17 - "XIcon / Modal.tsx"
Cohesion: 0.19
Nodes (10): XIcon, ModalProps, useRevealOnView(), Reveal(), RevealProps, EASE_SMOOTH, EASE_SNAPPY, heroEntranceVariant (+2 more)

### Community 18 - "layout.tsx / generateStaticParams()"
Cohesion: 0.17
Nodes (8): ibmPlexMono, ibmPlexSansArabic, inter, metadata, RootLayoutProps, spaceGrotesk, viewport, Preloader()

### Community 19 - "About.tsx / About()"
Cohesion: 0.20
Nodes (10): About(), AboutProps, AboutStatsValues, getPrincipleIcon(), getStatIcon(), BriefcaseIcon, DatabaseIcon, GlobeIcon (+2 more)

### Community 20 - "RootLayout() / opengraph-image.tsx"
Cohesion: 0.22
Nodes (10): RootLayout(), alt, contentType, ImageProps, OpenGraphImage(), runtime, size, generateMetadata() (+2 more)

### Community 21 - "route.tsx / dynamic"
Cohesion: 0.24
Nodes (9): dynamic, EstimateDocument(), inputSchema, priceFor(), runtime, styles, getLocalizedList(), samplePlans (+1 more)

### Community 22 - "[locale]/page.tsx / HomePage()"
Cohesion: 0.31
Nodes (7): HomePage(), PageProps, revalidate, runtime, ClientHomeShell(), isCurrency(), resolveServerCurrency()

### Community 23 - "BrandLogo.tsx / BrandLogo()"
Cohesion: 0.28
Nodes (7): BrandLogo(), BrandLogoProps, Footer(), phoneToIntl(), MailIcon, PhoneIcon, ShieldCheckIcon

### Community 24 - "serviceIconMap / TechStackBanner.tsx"
Cohesion: 0.31
Nodes (8): serviceIconMap, categorizeTech(), CATEGORY_TABS, CategoryKey, CategoryTab, getTechBadge(), getTechRole(), TechStackBanner()

### Community 25 - "CaseStudyDetail.tsx / Markdown"
Cohesion: 0.25
Nodes (6): Markdown, nodeTypeKey, ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GithubIcon

### Community 26 - "CalEmbed.tsx / CalEmbed()"
Cohesion: 0.38
Nodes (6): CalEmbed(), CalGlobal, CalNamespace, loadCalScript(), parseLink(), Window

### Community 27 - "ClockIcon / CpuChipIcon"
Cohesion: 0.33
Nodes (6): ClockIcon, CpuChipIcon, LayersIcon, XRayDrawer(), XRayDrawerProps, CaseStudyXRaySpecs

### Community 28 - "i18n / middleware.ts"
Cohesion: 0.47
Nodes (5): i18n, config, getCurrencyForCountry(), getLocaleFromHeader(), middleware()

### Community 29 - "next.config.ts / calOrigins"
Cohesion: 0.33
Nodes (5): calOrigins, configuredCalOrigins, contentSecurityPolicy, nextConfig, securityHeaders

### Community 30 - "icon.tsx / contentType"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

## Knowledge Gaps
- **210 isolated node(s):** `runtime`, `dynamic`, `revalidate`, `PageProps`, `spaceGrotesk` (+205 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `B2BTrustBadgeProps / BookingGateModalPro` to `revalidate/route.ts / dynamic`, `CaseStudyDetailPage() / LeadFormProps`, `ClientLogosSection.tsx / ClientLogosSect`, `RoiCalculator / CheckIcon`, `BookingGateModal.tsx / BookingGateModal(`, `not-found.tsx / dynamic`, `B2BTrustBadge.tsx / B2BTrustBadge()`, `CaseStudyGrid.tsx / CaseStudyGrid()`, `Hero.tsx / Hero()`, `CheckCircleIcon / SendIcon`, `[slug]/page.tsx / dynamic`, `layout.tsx / generateStaticParams()`, `RootLayout() / opengraph-image.tsx`, `route.tsx / dynamic`, `[locale]/page.tsx / HomePage()`, `BrandLogo.tsx / BrandLogo()`, `serviceIconMap / TechStackBanner.tsx`, `CaseStudyDetail.tsx / Markdown`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Dictionary` connect `B2BTrustBadgeProps / BookingGateModalPro` to `health/route.ts / dynamic`, `CaseStudyDetailPage() / LeadFormProps`, `ClientLogosSection.tsx / ClientLogosSect`, `RoiCalculator / CheckIcon`, `BookingGateModal.tsx / BookingGateModal(`, `not-found.tsx / dynamic`, `B2BTrustBadge.tsx / B2BTrustBadge()`, `CaseStudyGrid.tsx / CaseStudyGrid()`, `Hero.tsx / Hero()`, `CheckCircleIcon / SendIcon`, `About.tsx / About()`, `route.tsx / dynamic`, `BrandLogo.tsx / BrandLogo()`, `serviceIconMap / TechStackBanner.tsx`, `CaseStudyDetail.tsx / Markdown`, `ClockIcon / CpuChipIcon`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `isDbConfigured()` connect `revalidate/route.ts / dynamic` to `[slug]/page.tsx / dynamic`, `health/route.ts / dynamic`, `CaseStudyDetailPage() / LeadFormProps`, `POST() / case-studies/route.ts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `runtime`, `dynamic`, `revalidate` to the rest of the system?**
  _210 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `revalidate/route.ts / dynamic` be split into smaller, more focused modules?**
  _Cohesion score 0.051189400782896716 - nodes in this community are weakly interconnected._
- **Should `health/route.ts / dynamic` be split into smaller, more focused modules?**
  _Cohesion score 0.06553128470936691 - nodes in this community are weakly interconnected._
- **Should `CaseStudyDetailPage() / LeadFormProps` be split into smaller, more focused modules?**
  _Cohesion score 0.06398390342052314 - nodes in this community are weakly interconnected._