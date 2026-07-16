# AEO + GEO Playbook — Evidence Base for site-director

Compiled: 2026-07-15. All sources verified live on that date; access dates in `## Sources`.
Scope: what measurably earns citations/answers in AI engines (ChatGPT, Perplexity, Claude,
Gemini/AI Overviews, Copilot) and how to implement it in copy, markup, and robots.txt during
an autonomous site build. Companion file (sibling checklist) holds full JSON-LD templates.

Evidence tiers used throughout:
- **T1 peer-reviewed** — Princeton GEO paper, KDD'24 [S2][S3]
- **T2 deterministic/vendor-documented** — crawler docs, Google Search Central [S7-S10, S12-S16]
- **T3 industry-measured** — log studies, tracked cohorts [S5][S18][S19]
- **T4 vendor claims, methodology unpublished** — treat as directional only [S20]

---

## 1. TL;DR — the 10 tactics that matter, ranked by evidence strength

| # | Tactic | Evidence | Tier |
|---|--------|----------|------|
| 1 | **Allow AI search/user crawlers in robots.txt** (OAI-SearchBot, Claude-SearchBot, Claude-User, PerplexityBot, Googlebot). Blocked = mechanically invisible; OpenAI: opted-out sites don't appear in ChatGPT search answers [S12] | Deterministic | T2 |
| 2 | **Add attributed expert quotations** to key pages: +41% visibility (Position-Adjusted Word Count), +28% subjective impression [S3] | Largest single lift in KDD'24 study | T1 |
| 3 | **Add sourced statistics** (number + source + year inline): +31% PAWC, +22% SI [S3] | T1 |
| 4 | **Cite authoritative sources inline**: +30% PAWC; biggest equalizer — rank-5 sites gained +115.1% visibility [S3] | T1 |
| 5 | **Answer-first, fluent copy**: Fluency Optimization +24% PAWC, Easy-to-Understand +13% [S3]; every 2026 guide converges on "direct answer first, then context" [S6] | T1 + consensus |
| 6 | **JSON-LD structured data** (Organization/LocalBusiness, Service, Article, Breadcrumb). Google-documented comprehension layer; JSON-LD is Google's recommended format [S7] | T2 |
| 7 | **Entity + NAP consistency and earned media**: consistent brand facts across web, About/author pages, third-party mentions — "AI engines favor earned media" [S6] | T3 |
| 8 | **Freshness**: visible dateModified, current-year data; Perplexity notably rewards recency; stale 2024 content loses to updated 2026 content on same topic [S6][S19] | T3 |
| 9 | **Question-mapped Q&A content** (PAA-style H2s + 40-60-word standalone answers). Content format matters even though Google's FAQ rich result is dead (May 2026) [S9] | T3 |
| 10 | **llms.txt + llms-full.txt**: ship it (15 min, zero risk) but expect no citation lift — no major AI crawler confirmed to consume it [S5][S18][S19] | T3 (negative-to-neutral) |

Anti-tactic (T1): **keyword stuffing** — worst performer in KDD'24, "little to no improvement,"
at times below baseline [S3]. Never generate stuffed copy.

---

## 2. llms.txt

### 2.1 Spec digest [S1]
- Proposed by Jeremy Howard, 2024-09-03. Plain markdown at root: `/llms.txt`.
- Format, in order: `# H1 project/site name` (only required element) → `> blockquote` one-line
  summary → optional prose/details → `## H2` sections each containing a markdown link list:
  `- [name](url): note`.
- `## Optional` is a reserved section name: consumers may skip it when context is tight.
- Companion provision: serve clean markdown of any page at same URL + `.md`
  (`/page.html.md` or `/index.html.md`).
- `llms-full.txt`: same idea but the **full content inlined** in one file (index vs corpus).
  Docs platforms (Mintlify et al.) auto-generate both; Anthropic and Perplexity publish their own.

### 2.2 Adoption reality — be honest (as of 2026-07)
- Adoption ~10% of domains (SE Ranking, 300k-domain study cited in 2026 guides) [S18].
- **No confirmed consumption by major AI crawlers.** Google's Gary Illyes (July 2025): Google
  doesn't support it and isn't planning to; John Mueller compared it to the keywords meta tag
  and noted server logs show bots "don't even check for it" [S5][S18].
- 90-day log analyses in 2026 put direct llms.txt fetches at ~0.1% of AI-bot requests [S18][S19].
- Search Engine Land tracked 10 sites 90 days pre/post: no visibility effect attributable to the
  file; verdict "like a sitemap: useful infrastructure, not a growth lever" [S5].
- Who *does* fetch it: IDE/coding agents (Cursor, Claude Code, Copilot), MCP servers, docs
  assistants [S18]. For a business site the payoff is future-proofing + agent usability, not GEO.

### 2.3 Template skeletons

`/llms.txt`:
```markdown
# {Business Name}
> {One sentence: what the business does, for whom, where.}
{2-3 lines: services, service area, differentiators, founded year.}
## Services
- [{Service A}](https://site.com/services/a.md): {one-line description w/ price anchor}
- [{Service B}](https://site.com/services/b.md): {one-line description}
## Company
- [About](https://site.com/about.md): team, licenses, certifications
- [Contact](https://site.com/contact.md): phone, address, hours
## Optional
- [Blog index](https://site.com/blog.md): guides and cost breakdowns
```

`/llms-full.txt`:
```markdown
# {Business Name} — full content
> {Same one-line summary.}
<!-- Concatenate the .md version of every indexable page, in nav order.
     Separate pages with an H2 of the page title + canonical URL line.
     Regenerate on every deploy; keep under ~500KB. -->
## {Page title}
Source: https://site.com/{path}
{full page content as clean markdown}
```

---

## 3. GEO tactics — evidence table

### 3.1 KDD'24 results (Princeton et al., GEO-bench, 10k queries) [S2][S3]

| Tactic | Visibility Δ (PAWC) | Subjective Δ | Implement in copy as |
|--------|--------------------|--------------|--------------------|
| Quotation Addition | **+41%** | +28% | Named, credentialed quotes: `"...," says {Name}, {title/credential}`. 1-2 per money page. Real people only (owner, licensed tech, cited expert). |
| Statistics Addition | **+31%** | +22% | Replace vague claims with numbers + source + year: "AC failures spike 40% in June (SRP grid data, 2025)". Prefer proprietary data (job counts, response times). |
| Cite Sources | **+30%** | +15% | Inline links/references to .gov, manufacturer specs, utility data, industry bodies. Biggest lift for low-authority sites: rank-5 sources gained **+115.1%**; top-ranked lost 30.3% share — GEO "democratizes" citation [S3]. |
| Fluency Optimization | +24% | +12% | Short sentences, active voice, no filler; each paragraph parses standalone. |
| Easy-to-Understand | +13% | +5% | Plain language, define jargon at first use, 8th-grade reading level for consumer services. |
| Authoritative (tone) | modest | modest | Confident declaratives; best in debate/history domains — weak for local service copy. |
| Technical Terms | ~0 | ~0 | Skip as a tactic; use terms only where accurate. |
| Unique Words | ~0 | ~0 | Skip. |
| Keyword Stuffing | **≤0 (negative)** | ≤0 | **Prohibited.** |

Domain sensitivity [S3]: citations best for factual queries; statistics strongest in
law/government/debate/opinion; quotations best in people/society/explanation/history.
Stack 2-3 tactics per page (quote + stat + citation), not all nine.

### 3.2 2026 follow-ups
- **Answer-first sections**: open every H2 with the direct answer, then expand; AI engines
  lean on clear Q&A pairs when composing responses (SEL, 2026-02-23) [S6]. T3.
- **Earned media > owned claims**: third-party coverage, reviews, and industry mentions weigh
  more than self-description; digital PR is a direct GEO lever [S6]. T3.
- **Citation economics**: AI answers typically cite only 2-7 domains per response — winner-take-
  most; being "pretty good" earns nothing [S6]. T3.
- **Original data attracts citations**: benchmarks, unique datasets, frameworks nobody else has
  give engines a *reason* to cite you [S6]. T3.
- **Platform skews**: Google AI Overviews pull mostly from top-10 organic (classic SEO still
  gates AIO); Perplexity rewards freshness + authority; Copilot leans on LinkedIn for B2B [S19]. T3.
- **List-structured pages**: vendor roundups claim ~74% of AI citations land on structured
  "Top N"/list-format pages [S20]. Methodology unpublished — directional only (T4), but costless:
  prefer numbered lists, tables, and comparison blocks over prose walls.

### 3.3 Copy implementation rules (what the builder agent does)
1. Every service/money page gets: 1 attributed quote, 2+ sourced statistics, 1-2 inline
   authoritative citations, answer-first opening paragraph (40-60 words).
2. Entity block on every page footer + About: exact same business name, address, phone (NAP),
   matching Google Business Profile and all directories, character-for-character.
3. Visible `Last updated: {date}` on cornerstone pages; refresh stats to current year.
4. No superlatives without a number or source attached.

---

## 4. AEO — answer engine optimization

### 4.1 Question mapping (PAA-style)
- Mine questions from: Google People-Also-Ask for each target query, autocomplete
  ("how much / how long / is it worth / vs"), Reddit/forum phrasings, GBP Q&A, sales-call FAQs.
- Map **one primary question per H2**; phrase the H2 as the question users actually ask
  ("How much does AC repair cost in Phoenix?" not "Pricing").
- Cover the full intent ladder per service: cost, duration, DIY-vs-pro, signs-you-need,
  comparison (X vs Y), "best {service} near me" qualifiers, seasonality.
- Conversational long-tail: AI queries average longer, natural-language phrasings (7+ words,
  who/what/why/best-for modifiers). Write headings and answers to match spoken questions [S6][S19].

### 4.2 Answer formatting rules (extraction-ready)
- **40-60 word direct answer** immediately under the question H2. Standalone: no pronouns
  referencing prior text; restate the entity ("AC repair in Phoenix costs..." not "It costs...").
- Definition queries → "X is ..." first sentence. Process queries → numbered steps (3-8).
  Comparison queries → HTML table. Cost queries → range + factors bulleted.
- Featured-snippet legacy rules still describe the extractable unit: ~40-60-word paragraph,
  lists of 5-8 items, tables with header rows. Same unit AI engines lift.
- One idea per paragraph; H2/H3 hierarchy clean and literal [S6].

### 4.3 FAQ blocks — current status (important)
- **Google FAQ rich results are gone.** Restricted to gov/health sites Aug 2023, then removed
  from Search entirely (announced May 2026; docs deleted June 2026) [S9]. HowTo rich results
  deprecated 2023-09-14 [S10].
- **Keep on-page Q&A sections anyway** — the content format is what AI engines extract [S6].
- FAQPage JSON-LD: optional, low-cost, harmless; may aid non-Google parsers. Do not promise the
  client Google rich results from it. HowTo markup: skip unless content is genuinely stepwise.

---

## 5. AI-crawler user-agent table

Recommendation column = a business site that **wants** AI visibility. Verified 2026-07-15.
Tokens below are the robots.txt match strings; full UA strings carry version suffixes that
drift (e.g. `GPTBot/1.x (+https://openai.com/gptbot)`) — verify at the cited doc when generating
server rules.

| UA token | Vendor | Purpose | robots.txt | Recommendation |
|----------|--------|---------|-----------|----------------|
| `GPTBot` | OpenAI | Foundation-model training | Respected [S12] | **Allow** — training presence feeds brand knowledge in models |
| `OAI-SearchBot` | OpenAI | ChatGPT search index + citations | Respected; blocking removes site from ChatGPT search answers [S12] | **Allow (critical)** |
| `ChatGPT-User` | OpenAI | User-initiated fetches (browse, GPT Actions) | May not apply — user-initiated [S12] | **Allow** |
| `ClaudeBot` | Anthropic | Model training | Respected [S13] | **Allow** |
| `Claude-SearchBot` | Anthropic | Claude search index quality | Respected [S13] | **Allow (critical)** |
| `Claude-User` | Anthropic | Fetches when users ask Claude | Respected; blocking "may reduce your site's visibility" [S13] | **Allow (critical)** |
| `PerplexityBot` | Perplexity | Search/answer index (not training) | Respected; blocked sites don't appear in results [S14] | **Allow (critical)** |
| `Perplexity-User` | Perplexity | User-initiated fetches | "Generally ignores" robots.txt (user-initiated) [S14] | Allow (moot) |
| `Googlebot` | Google | Search + the index AI Overviews draws from | Respected [S8] | **Allow (critical)** — AIO eligibility rides on normal indexing |
| `Google-Extended` | Google | Control token: Gemini training + grounding. Explicitly does **not** affect Search inclusion/ranking [S8] | Respected | **Allow** for Gemini-surface visibility |
| `Google-CloudVertexBot` | Google | Vertex AI site-owner-requested crawls [S8] | Respected | Allow (n/a unless client uses Vertex) |
| `CCBot` | Common Crawl | Open corpus; feeds many LLM training sets [S15] | Respected (`CCBot/2.0`) | **Allow** — cheap route into future model training data |
| `meta-externalagent` | Meta | AI training + product indexing [S16] | Respected | **Allow** |
| `meta-externalfetcher` | Meta | User-requested link fetches / agentic AI [S16] | May bypass (user-initiated) | Allow (moot) |
| `facebookexternalhit` | Meta | Link previews (FB/IG/Messenger) [S16] | Mostly respected; may bypass for integrity checks | **Allow** — social previews |
| `Bytespider` | ByteDance | AI training (Doubao/TikTok products) | Claims compliance; 2023 log evidence of crawling disallowed paths; compliance "a matter of ongoing monitoring" [S17] | Allow if any ByteDance-surface visibility wanted; if blocking, do it at server/CDN level — robots.txt alone unreliable [S17] |

Default robots.txt posture for site-director builds: allow all of the above explicitly (belt-and-
suspenders against inherited deny rules), disallow only admin/cart/search paths:

```
User-agent: *
Disallow: /admin/
Sitemap: https://site.com/sitemap.xml
# Explicit AI allows (protects against blanket denials upstream)
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: CCBot
User-agent: meta-externalagent
Allow: /
```

---

## 6. JSON-LD priority by page type

Full templates live in the sibling checklist file — this is the what/why map. JSON-LD is
Google's recommended format; markup must describe **visible** page content only [S7].

| Page type | Schema type(s) | Why (one line) |
|-----------|---------------|----------------|
| All pages | `BreadcrumbList` + `WebPage`/`WebSite` | Site architecture + entity graph glue; breadcrumb trails in results [S7] |
| Home | `Organization` **or** `LocalBusiness` subtype | The entity anchor: canonical name, logo, `sameAs` profiles, NAP — feeds knowledge panels and entity consistency [S6][S7] |
| Location/home (local biz) | `LocalBusiness` subtype (`HVACBusiness`, `Plumber`, ...) + `geo`, `openingHours`, `areaServed` | Local pack + "near me" AI answers need machine-readable NAP [S11] |
| Service pages | `Service` (+ `provider`, `areaServed`, `offers`) | Tells engines exactly what is sold and where — maps to "who does X in Y" queries [S11] |
| FAQ sections | `FAQPage` (optional) | No Google rich result since May 2026 [S9]; harmless, may aid non-Google parsers — content format is what matters |
| How-to content | `HowTo` optional-to-skip | Google deprecated the rich result 2023-09 [S10]; keep stepwise HTML instead |
| Articles/blog | `Article`/`BlogPosting` (+ `author` as `Person`, `datePublished`, `dateModified`) | Author entity + freshness signals — both GEO levers [S6][S7] |
| Reviews | `AggregateRating` on LocalBusiness/Service | Star data where policy-compliant; third-party proof signal [S7] |

Rules: one `@graph` per page linking entities by `@id`; never mark up content not on the page;
fewer complete properties beat many sloppy ones [S7]. schema.org vocabulary current at v30.0
(2026-03-19) [S11].

---

## 7. Verification checklist

Markup:
- [ ] `https://validator.schema.org/` — syntax + vocabulary per page template
- [ ] `https://search.google.com/test/rich-results` — Google feature eligibility [S7]
- [ ] Search Console: URL Inspection confirms markup discovered; enhancement reports clean [S7]

Crawler access:
- [ ] Fetch `/robots.txt` — confirm no deny matches any token in §5 table
- [ ] `curl -A "GPTBot" https://site.com/ -I` (repeat per critical UA) → 200, no bot-wall
- [ ] CDN/WAF (Cloudflare etc.): confirm "AI bots" blocking toggle is OFF for allowed UAs
- [ ] Verify suspicious hits against published IP ranges (OpenAI, Perplexity, CCBot publish
      JSON lists; CCBot: `index.commoncrawl.org/ccbot.json`) [S15]

llms.txt:
- [ ] `/llms.txt` + `/llms-full.txt` return 200 text/plain-or-markdown; every listed URL 200s

AI visibility probes (post-launch, then monthly):
- [ ] Ask ChatGPT (search mode), Perplexity, Claude, and Google (AIO) the top 5 mapped
      questions + "best {category} in {city}" — record whether/how site is cited
- [ ] Branded probe: "what is {business name}" across the same engines — check fact accuracy
- [ ] GA4: referral traffic from `chatgpt.com`, `perplexity.ai`, `gemini.google.com`,
      `copilot.microsoft.com`; annotate launch date [S6]
- [ ] Server logs: confirm OAI-SearchBot / Claude-SearchBot / PerplexityBot hits within 30 days
- [ ] NAP audit: exact-match name/address/phone across site footer, GBP, top directories

---

## Sources

All accessed 2026-07-15.

- [S1] llms.txt spec — https://llmstxt.org
- [S2] Aggarwal et al., "GEO: Generative Engine Optimization," KDD 2024 (abstract) — https://arxiv.org/abs/2311.09735
- [S3] Same paper, full text (method/effect tables) — https://arxiv.org/html/2311.09735v3
- [S4] Search Engine Land, "llms.txt proposed standard" (2025-03-28) — https://searchengineland.com/llms-txt-proposed-standard-453676
- [S5] Search Engine Land, "Does llms.txt matter? We tracked 10 sites" (2026-01-20) — https://searchengineland.com/does-llms-txt-matter-467740
- [S6] Search Engine Land, "Mastering GEO in 2026: full guide" (2026-02-23) — https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
- [S7] Google, Intro to structured data (JSON-LD guidance) — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- [S8] Google, Common crawlers incl. Google-Extended — https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- [S9] Google, FAQPage docs (feature removed May 2026; docs removed June 2026) — https://developers.google.com/search/docs/appearance/structured-data/faqpage
- [S10] Google, HowTo docs (deprecated 2023-09-14, changelog) — https://developers.google.com/search/docs/appearance/structured-data/how-to
- [S11] schema.org (v30.0, 2026-03-19) — https://schema.org
- [S12] OpenAI bots (GPTBot, OAI-SearchBot, ChatGPT-User) — https://developers.openai.com/api/docs/bots
- [S13] Anthropic crawler support article (ClaudeBot, Claude-SearchBot, Claude-User) — https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- [S14] Perplexity crawlers (PerplexityBot, Perplexity-User) — https://docs.perplexity.ai/guides/bots
- [S15] Common Crawl CCBot — https://commoncrawl.org/ccbot
- [S16] Meta web crawlers (meta-externalagent, meta-externalfetcher, facebookexternalhit) — https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
- [S17] cside, "How to block Bytespider" (compliance history) — https://cside.com/blog/how-to-block-bytespider
- [S18] limy.ai, "LLMs.txt in 2026: The Full Guide" (adoption + log stats) — https://limy.ai/blog/llms.txt-in-2026-the-full-guide
- [S19] codersera, "llms.txt Explained (May 2026)" (crawler-hit measurements; platform skews) — https://codersera.com/blog/llms-txt-complete-guide-2026/
- [S20] GenOptima, "GEO Best Practices: 2026 Playbook" (list-format citation claim, T4) — https://www.gen-optima.com/blog/generative-engine-optimization-best-practices-complete-2026-playbook/
