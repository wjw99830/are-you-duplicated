#!/usr/bin/env node

const { readdirSync, statSync, existsSync } = require('fs');
const path = require('path');

const PKG = 'package.json';
const MODULES = 'node_modules';

const { argv } = process;

const PACKAGE = argv[2];
if (!PACKAGE) {
  console.log(`Package name is required.
e.g. dup react`);
}


let count = 1;

function mark(dir, version) {
  const str = `${count++}.
  Path: ${dir}
  Version: ${version}`;
  console.log(str);
}

function searchPackage(dir) {
  try {
    const files = readdirSync(dir);
    if (files.includes(PKG)) {
      const { name, version } = require(path.join(dir, PKG));
      if (name === PACKAGE) {
        mark(dir, version);
        return;
      }
    }
    if (files.includes(MODULES)) {
      searchModules(path.join(dir, MODULES));
    }
  } catch (e) {
  }
}

function searchModules(dir) {
  if (!existsSync(dir)) {
    console.warn(`There is no <${MODULES}> in this directory.`);
    return;
  }
  const s = statSync(dir);
  if (!s.isDirectory()) {
    return;
  }
  const pkgs = readdirSync(dir);
  for (const pkg of pkgs) {
    const dirpath = path.resolve(dir, pkg);
    searchPackage(dirpath);
  }
}

searchModules('./' + MODULES);

if (count === 1) {
  console.log(`There's no this package <${PACKAGE}>. Are you sure it's installed?`);
}
