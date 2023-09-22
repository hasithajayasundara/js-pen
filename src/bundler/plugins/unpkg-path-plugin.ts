import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      // handle root entry
      build.onResolve({ filter: /(^index\.js$)/ }, () => ({
        path: 'index.js', namespace: 'a',
      }));

      // handle relative path
      build.onResolve({ filter: /^\.+\// }, (args: any) => ({
        namespace: 'a',
        path: new URL(
          args.path,
          'https://unpkg.com' + args.resolveDir + '/'
        ).href,
      }));

      // handle main file in a pkg
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
