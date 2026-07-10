# Invoice field character limits

Long pasted legal text can overflow invoice templates. Keep limits in one module
(for example `src/constants/fieldLimits.js` when present) and wire them through
`EditableField`.

## Recommended caps (starting point)

| Field | Suggested `maxLength` | Show near-limit counter? |
| --- | ---: | --- |
| Business / customer name | 80 | yes near 90% |
| Email | 120 | no |
| Phone | 32 | no |
| Address lines | 120 each | yes |
| Line-item description | 120 | yes |
| Notes / terms | 500 | yes |
| Invoice number | 40 | no |

## Template checklist

- [ ] Import shared limits (do not hardcode per template)
- [ ] Pass `maxLength` into `EditableField`
- [ ] Verify all templates (Classic, Modern, Retail, …) share the same caps
- [ ] Visual check at max length (no overflow of totals block)

## For contributors

Prefer a single PR that updates the constants module + every template that renders the field.
