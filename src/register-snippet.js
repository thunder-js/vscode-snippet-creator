import path from 'path'
import fs from 'fs-extra'

const BASE_SNIPPETS_PATH = '/Users/rafaelribeirocorreia/Library/Application Support/Code/User/snippets/'

const getPathForLanguage = language => path.join(BASE_SNIPPETS_PATH, `${language}.json`)

const snippetAlreadyExists = (snippets, name) => !!snippets[name]

const getBackupPath = language => path.join(BASE_SNIPPETS_PATH, `bkp_${language}.json`)

const buildSnippetJson = (prefix, body) => ({
  prefix,
  body,
})

const assocSnippet = (snippets, name, snippet) => ({
  ...snippets,
  [name]: snippet,
})

export default async (language, name, prefix, body, force) => {
  const jsonPath = getPathForLanguage(language)
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`${jsonPath} does not exist.`)
  }

  const snippets = await fs.readJson(jsonPath)
  if (!force && snippetAlreadyExists(snippets, name)) {
    throw new Error(`Snippet ${name} already exists. provide --force to override`)
  }

  const parsedBody = JSON.parse(body)
  const newSnippet = buildSnippetJson(prefix, parsedBody)
  const newSnippets = assocSnippet(snippets, name, newSnippet)

  console.log('Writing backup file...')
  await fs.writeJson(getBackupPath(language), snippets, { spaces: '\t' })
  console.log('Writing new file...')
  await fs.writeJson(jsonPath, newSnippets, { spaces: '\t' })
}