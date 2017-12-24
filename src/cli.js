#!/usr/bin/env node
import program from 'commander'

const list = val => val.split(',')

program
  .version('0.1.0')
  .option('-d, --datasets <items>', 'The datasets to generate', list)
  .parse(process.argv);
