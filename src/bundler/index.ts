import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin, fetchPlugin } from './plugins';

export class Bundler {
  private wasmUrl = 'https://unpkg.com/esbuild-wasm@0.19.3/esbuild.wasm';
  private static bundler: Bundler = new Bundler();
  private isInitialized = false;

  private constructor() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.initialize();
    }
  }

  static getInstance() {
    return this.bundler;
  }

  private async initialize() {
    try {
      await esbuild.initialize({ wasmURL: this.wasmUrl });
    } catch (err) {
      console.log(err);
    }
  }

  transform(rawCode: string) {
    return esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: { global: 'window' },
    });
  }
}
