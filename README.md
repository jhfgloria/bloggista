# Bloggista  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/bloggista)](https://img.shields.io/npm/v/bloggista) 

### The blogging tool for those who love HTML

Bloggista is a CLI tool to create and manage blogs. It offers a set of commands that allow you to perform multiple operations from your terminal.

### Example

[JHFGloria blog](https://jhfgloria.com/)
| [Repository](https://github.com/jhfgloria/jhfgloria.github.io)

# Install

### Requirements

Bloggista was developed using [NodeJS](https://nodejs.org/en/) version 14.19.2.

### Global installation

Bloggista is a NPM library, which means it lives in npmjs.com. It is also a CLI application, which means it consists of a set of commands that you can execute. The most common use for Bloggista is to install it globally.

```
> npm install -g bloggista
```

This will give you access to all [CLI](#cli) commands from your terminal.

# Usage

## Templating

Bloggista uses a template format to be able to build your entire blog. You may see some files containing expressions in the form `{{expression}}`.

### - `{{body}}`

The body is the expression that will be replaced by the blog posts. It can be found on the `config/index.html` when you first create the blog. It is very important that you don't change this (unless you know what you're doing).

### - `{{link-to:<postID>}}`

The link-to is a very important expression in Bloggista. It allows you to create links to other pages in the blog. This expression is going to be replaced by an anchor HTML element (&lt;a&gt;) given a valid post ID. You don't need to care about where the anchor's address, Bloggista will handle it for you.

```
{{link-to:20221028185120899-about-me}}
```

## CLI

All commands in Bloggista should start with the prefix `bloggista`.

### - `init`

The `init` command creates a folder with the given name with the contents of your blog in it. The structure of the blog can be found in [here](#structure). Example:

```
> bloggista init my_blog
```

### - `post`

The `post` command creates a post under a given `path`. If no path is provided the post will be created directly inside the content folder. You'll notice that the created file will not have the given `name`, but instead a variation of `yyyymmddHHMMSS-<name>`. This grants unique names, which makes it easier to create references to the files. Also, it adds the post to the posts registry inside `bloggista.json`.

```
> bloggista post my_post -p blog/devlog
```

### - `build`

The `build` command is the backbone of Bloggista. It is what allows all your HTML files to be compiled into a beautiful blog. The results of the build will be available `/dist`.

```
> bloggista build
```

# Structure

When you generate your blog you'll find the following structure:

```
blog/
|- content/
|- config/
  |- index.html
  |- custom.css
|- assets
|- dist/
|- node_modules/
|- package.json
|- package-lock.json
|- bloggista.json
```

### - `content`

The content folder is where the actual blog posts will be. You SHOULD NOT create your posts manually. Instead use the [post](#post) command. The content folder will express how your blog will look like. Posts directly under content will be at the root of your website, while posts inside inner folders will be routed to the name of their folder.

### - `config`

The config folder contains the necessary files to build the blog, namely the `index.html` file, which contains the HTML structure of all your pages, and the `custom.css` file, whiere you can create your own stylesheet (Bloggista does not impose any style).

### - `assets`

The assets folder contains the media assets that are going to be made available in your blog posts. Its contents are going to be copied into a homonymous folder inside the dist folder.

### - `dist`

The dist folder will not be present on `init` time. Rather, it will be created on `build` time and it will contain the final version of your blog. You can distribute the generated files in order to host your blog.

### - `node_modules` and `package-lock.json`

The node_modules folder and the package-lock.json are both products of `npm install`. You don't need to care about these (they won't even show up on `init` time). These are only necessary in case you need to run your blog from another machine, where Bloggista is not installed globally. In that case you should run it like:

```
npx bloggista <command>
```

### - `package.json`

This file is not important in case your only running Bloggista from your machine (where Bloggista is globally installed). In case you have to run your project in another machine (like CI), there is a package.json file with the necessary dependencies to run your blog. You will need to run `npm install` to get the dependencies locally available. 

### - `bloggista.json`

This JSON file is where all metadata about the blog is preserved. You can find there the name of your blog, given at `init` time, and the posts registry. The posts registry contains all information from posts created with `post`. You should not change this file (unless you know what you're doing!).

Made with ♥️