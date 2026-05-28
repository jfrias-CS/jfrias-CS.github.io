# jfrias-cs.github.io

Personal portfolio site for Jonathan Frias — live at [jfrias-cs.github.io](https://jfrias-cs.github.io).

Vanilla HTML, CSS, and JS — no build step, no framework, no JS dependencies. Single-page scroll with semantic sections (Hero, About, Experience, Projects, Education, Contact).

## Files

- `index.html` — page structure + content
- `styles.css` — dark-themed design system with CSS variables
- `script.js` — smooth-scroll + active-nav highlight (vanilla, ~30 LOC)
- `resume.html` — printable resume source
- `Jonathan_Frias_Resume.pdf` — generated from `resume.html` via Chrome headless
- `Professional_Profile_Pic.jpg` — hero photo

## Regenerating the resume PDF

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="Jonathan_Frias_Resume.pdf" \
  "file://$(pwd)/resume.html"
```

Edit `resume.html` to update content, then re-run the command above.
