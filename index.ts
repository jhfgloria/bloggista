#!/usr/bin/env node

import { Command } from "commander";
import chokidar from "chokidar";

import * as Package from "./package.json";
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
       .option('-p, --path <filePath>', 'path under which post is stored (path can be recursive)')
       .description('Creates a blog post')
       .action((name, { path }) => createPostCommand(name, path));

program.command('build')
       .option('-w, --watch', 'keeps build command running', false)
       .description('Builds the entire blog structure into the dist folder')
       .action(({ watch }) => {
        buildCommand();

        if (watch) {
          const watcher = chokidar.watch(['./content', './config'], {
            ignored: /(^|[\/\\])\../,
            persistent: true
          });
          console.log("Building your blog in watch mode");
          watcher.on("change", () => buildCommand());
        }
      });

program.parse();
