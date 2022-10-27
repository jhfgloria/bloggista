#!/usr/bin/env node

import { Command } from "commander";

import * as Package from "./package.json";
import { Bloggista } from "./src/bloggista";
import { buildCommand } from "./src/build-command";
import { createPostCommand } from "./src/create-post-command";
import { initCommand } from "./src/init-command";

const program = new Command();

program.name('bloggista')
       .description('Bloggista provides you a CLI to create and manage your blog')
       .version(Package.version);

program.command('init')
       .argument('<name>', 'Name of the blog folder (can\'t contain spaces)')
       .description('Creates the blog structure into given folder name')
       .action(initCommand);

program.command('post')
       .argument('<name>', 'Name of the blog post (can\'t contain spaces)')
       .option('-p, --path <filePath>')
       .description('Creates a blog post under a folder if one is given')
       .action((name, { path }) => createPostCommand(name, path));

program.command('build')
       .description('Builds the entire blog structure into the dist folder')
       .action(buildCommand);

program.parse();
