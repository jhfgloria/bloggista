#!/usr/bin/env node

import { Command } from "commander";

import * as Package from "./package.json";
import { buildCommand } from "./src/build-command";

const program = new Command();

program.name('bloggista')
       .description('Bloggista provides you a CLI to create and manage your blog')
       .version(Package.version);

program.command('build')
       .description('Builds the entire blog structure into the dist folder')
       .action(buildCommand);

program.parse();
