import path from 'path';
import { productName } from './package.json';

import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';

import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack/webpack.main.config';
import { rendererConfig } from './webpack/webpack.renderer.config';

const rootDir = process.cwd();

const config: ForgeConfig = {
  packagerConfig: {
    name: 'ChatGPT',
    executableName: productName,
    icon: path.resolve(rootDir, 'images/icon'),
    extraResource: path.resolve(rootDir, 'images'),
    appBundleId: 'com.flaviodelgrosso.chatgpt',
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'flaviodelgrosso',
          name: 'chatgpt-tray-app',
        },
        prerelease: true,
      },
    },
  ],
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'ChatGPT',
    }),
    new MakerDMG({}, ['darwin']),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            name: 'chatgpt_window',
            html: './src/renderer/index.html',
            js: './src/renderer/index.ts',
          },
        ],
      },
    }),
  ],
};

export default config;
