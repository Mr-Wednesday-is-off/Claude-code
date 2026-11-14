// Lists every piece of text the app shows, and checks it against a translation file.
//
//   node scripts/i18n.mjs list          print all English text as JSON
//   node scripts/i18n.mjs check [lang]  report text missing from src/locales/<lang>.json
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [mode = 'check', lang = 'es'] = process.argv.slice(2)

const server = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
let strings
try {
  const { getSectionContent } = await server.ssrLoadModule('/src/content.jsx')
  const { collectStrings } = await server.ssrLoadModule('/src/translate.js')
  const { routes } = await server.ssrLoadModule('/src/routes.js')
  const { ui } = await server.ssrLoadModule('/src/uiStrings.js')
  const { searchIndex } = await server.ssrLoadModule('/src/searchIndex.js')

  const all = []
  for (const route of routes) collectStrings(getSectionContent(route.section, route.step, () => {}), all)
  all.push(...Object.values(ui))
  for (const entry of searchIndex) all.push(entry.title, entry.description)
  strings = [...new Set(all)]
} finally {
  await server.close()
}

if (mode === 'list') {
  console.log(JSON.stringify(strings, null, 2))
} else {
  const file = path.join(root, 'src', 'locales', `${lang}.json`)
  const dict = JSON.parse(fs.readFileSync(file, 'utf8'))
  const missing = strings.filter((text) => !dict[text])
  const unused = Object.keys(dict).filter((text) => !strings.includes(text))
  for (const text of missing) console.log(`MISSING  ${text}`)
  for (const text of unused) console.log(`UNUSED   ${text}`)
  console.log(`${lang}: ${strings.length - missing.length}/${strings.length} translated, ${unused.length} unused`)
  process.exitCode = missing.length ? 1 : 0
}
