#!/usr/bin/env node
import 'babel-polyfill'
import program from 'commander'
import getStdin from 'get-stdin'
import outputSnippet from './output-snippet'
import registerSnippet from './register-snippet'


const runSafely = fn => async (...args) => {
  try {
    await fn(...args)
  } catch (error) {
    console.log(error.toString())
    process.exit(1)
  }
}
program
  .version('0.1.0')

program
  .command('output')
  .option('-i, --input <inputFile>', 'The input file')
  .option('-m, --mappings <mappings>', 'Mappings')
  .action(runSafely(({ input, mappings }) => outputSnippet(input, mappings)))

const languages = ['typescript', 'typescriptreact']
const languagesRegExp = new RegExp(`^(${languages.join('|')})$`, 'i')

program
  .command('register')
  .option('-l, --language <language>', `Snippet language: ${languages.join(', ')}`, languagesRegExp)
  .option('-n --name <name>', 'Snippet name')
  .option('-p --prefix <prefix>', 'Snippet prefix')
  .action(runSafely(async ({ language, name, prefix }) => {
    const body = await getStdin()
    await registerSnippet(language, name, prefix, body)
  }))

program
  .command('new [input]')
  // .option('-i, --input <inputFile>', 'The input file')
  .option('-m, --mappings <mappings>', 'Mappings')
  .option('-l, --language <language>', `Snippet language: ${languages.join(', ')}`, languagesRegExp)
  .option('-n --name <name>', 'Snippet name')
  .option('-p --prefix <prefix>', 'Snippet prefix')
  .option('-f --force', 'Override any existing snippets')
  .action(runSafely(async (input, { mappings, language, name, prefix, force }) => {
    const snippetBody = await outputSnippet(input, mappings)
    await registerSnippet(language, name, prefix, snippetBody, force)
  }))
program.parse(process.argv);

