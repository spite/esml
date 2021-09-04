#!/usr/bin/env node

import fetch from "node-fetch";
import fs from "fs";
import util from "util";

const mkdir = util.promisify(fs.mkdir);

async function fetchConfig(repo) {
  const url = `https://raw.githubusercontent.com/spite/${repo}/master/esml.json`;
  const file = await fetch(url);
  const json = await file.json();
  return json;
}

async function downloadFile(repo, filename, url) {
  const file = await fetch(url);
  console.log(`Downloading ${filename}`);
  const fileStream = await fs.createWriteStream(`./esml/${repo}/${filename}`);
  file.body.pipe(fileStream);
}

async function main(options) {
  try {
    await mkdir(`./esml`);
  } catch (e) {}
  console.log("ESML");
  const repo = process.argv[2];
  const config = await fetchConfig(repo);
  const files = config.files;
  const scripts = [];
  if (files) {
    try {
      await mkdir(`./esml/${repo}`);
    } catch (e) {}
    for (let file of files) {
      const url = `https://raw.githubusercontent.com/spite/${repo}/master/${file}`;
      const script = downloadFile(repo, file, url);
      scripts.push(script);
    }
  }
  await Promise.all(scripts);
  console.log("Done");
}

main();
