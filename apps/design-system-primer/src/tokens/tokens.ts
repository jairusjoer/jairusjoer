import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import StyleDictionary from 'style-dictionary';
import { logVerbosityLevels } from 'style-dictionary/enums';
import { stylexTokensFormat } from './formatters/stylex-tokens';

StyleDictionary.registerFormat({
  name: 'stylex/tokens',
  format: stylexTokensFormat,
});

const source = ['src/tokens/tokens.json'];

function createStyleDictionary() {
  return new StyleDictionary({
    source,

    log: {
      verbosity: logVerbosityLevels.silent,
    },

    platforms: {
      tokens: {
        transformGroup: 'js',
        buildPath: 'src/',
        files: [
          {
            destination: 'styles/tokens.css',
            format: 'css/variables',
          },
          {
            destination: 'stylex/tokens.stylex.ts',
            format: 'stylex/tokens',
          },
        ],
      },
    },
  });
}

export function tokens(): AstroIntegration {
  async function generate(logger: AstroIntegrationLogger) {
    await createStyleDictionary().buildAllPlatforms();
    logger.info('generated.');
  }

  return {
    name: 'tokens',
    hooks: {
      'astro:server:setup': async ({ server, logger }) => {
        await generate(logger);

        server.watcher.on('change', async (file) => {
          if (source.some((candidate) => file.endsWith(candidate))) {
            await generate(logger);
          }
        });
      },
    },
  };
}
