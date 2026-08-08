# Desert Aire Heating & Cooling — Site Map

Domain: desertairemesa.com (fictional dry run) · Stack: Recipe B (Astro 5 +
Tailwind + React islands) · Theme: light only

## Pages

| Route | Page | Conversion goal | Primary keyword | Sections (order) |
|---|---|---|---|---|
| / | Home | phone call | ac repair mesa az | Hero (dual CTA) → Trust strip (ROC + reviews + same-day) → Services trio → Repair-first pledge → Service area (4 cities) → FAQ (3 Qs) → Final CTA band |
| /services | Services | quote form | ac repair, replacement and maintenance mesa az | Header + intro → AC Repair block → Replacement block (repair-vs-replace candor) → Maintenance block → Quote form → FAQ (9 Qs) → Call fallback band |
| /contact | Contact | call or form | desert aire… phone number | Header → Call-first block (phone, hours, response promise) → Quote form → Service area + NAP → FAQ (2 Qs) |

## Navigation

Header (all pages): wordmark (type-only) · Services · Contact · phone number
as text link (right-aligned, always visible). Mobile: sticky bottom call bar
(tel:) + hamburger for the two links.

Footer (all pages): NAP block (byte-identical everywhere) · ROC #329417 ·
service areas (Mesa, Gilbert, Chandler, Tempe) · hours · links to all pages.

## Internal link plan

- Home services trio → /services (block anchors); Home hero secondary CTA →
  /services quote form; Home service-area section → /contact.
- /services each block → /contact (call fallback) + form on-page.
- /contact → /services ("not sure what you need? see how we work").
- Every page ≥2 in ≥2 out via header/footer + in-body links above.

## Schema per page (values from site.ts only)

- / : HVACBusiness (geo, hours, areaServed, aggregateRating, license) + FAQPage(3)
- /services : Service ×3 + BreadcrumbList + FAQPage(9)
- /contact : ContactPage + HVACBusiness ref + BreadcrumbList + FAQPage(2)
