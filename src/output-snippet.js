import fs from 'fs-extra'

const buildTabStep = (number, name) => `$\{${number}:${name}}`
const buildContentWithMapping = (content, mappingPair, number) => content.replace(new RegExp(mappingPair[0], 'g'), buildTabStep(number + 1, mappingPair[1]))

//  mappings -> AllEvents:componentName,ITest:containerName
export default async (inputFile, mappingsString) => {
  const mappingPairs = mappingsString.split(',')
    .map(pairString => pairString.split(':'))

  const inputFileExists = await fs.pathExists(inputFile)

  if (!inputFileExists) {
    throw new Error(`${inputFile} does not exist.`)
  }

  const inputFileContent = await fs.readFile(inputFile, 'utf8')
  const contentWithMappings = mappingPairs.reduce(buildContentWithMapping, inputFileContent)

  const outputFileContent = contentWithMappings
    .split('\n')
    // .map(line => line.replace(new RegExp(' {2}', 'g'), '\\t'))

  return JSON.stringify(outputFileContent, null, 2)
}
