import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'file-cache',
});

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React, { useState } from 'react';
              console.log(React, useState);
            `,
          };
        }
        const cached = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
        if (cached) {
          return cached;
        }
        const { data, request } = await axios.get(args.path);
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
        fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};