import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import StyleDictionary from 'style-dictionary';
import { logVerbosityLevels } from 'style-dictionary/enums';

StyleDictionary.registerFormat({
  name: 'stylex/variables',
  format: ({ dictionary }) => {
    const tokens: Record<string, number | string> = {};

    for (const token of dictionary.allTokens) {
      if (token.$extensions?.['com.figma.type'] === 'boolean') {
        continue;
      }

      let value: number | string;

      switch (typeof token.$value) {
        case 'object':
          value = token.$value.value + token.$value.unit;
          break;

        case 'number':
          value = token.$value / 16 + 'rem';
          break;

        default:
          value = token.$value;
          break;
      }

      tokens[token.name] = value;
    }

    return [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
      "import * as stylex from '@stylexjs/stylex';",
      '',
      'export const vars = stylex.defineVars(',
      JSON.stringify(tokens, null, 2),
      ');',
      '',
    ].join('\n');
  },
});

const styleDictionary = new StyleDictionary({
  source: ['src/tokens/tokens.json'],

  log: {
    verbosity: logVerbosityLevels.silent,
  },

  platforms: {
    tokens: {
      transformGroup: 'js',
      buildPath: 'src/tokens/',
      files: [
        {
          destination: 'tokens.stylex.ts',
          format: 'stylex/variables',
          filter: (token) => token.path[0] !== 'primitive',
        },
      ],
    },
  },
});

export function tokens(): AstroIntegration {
  async function generate(logger: AstroIntegrationLogger) {
    await styleDictionary.buildAllPlatforms();
    logger.info('Generated');
  }

  return {
    name: 'tokens',
    hooks: {
      'astro:server:setup': async ({ server, logger }) => {
        await generate(logger);

        server.watcher.on('change', async (file) => {
          if (styleDictionary.source.find((source) => file.endsWith(source))) {
            await generate(logger);
          }
        });
      },
    },
  };
}
