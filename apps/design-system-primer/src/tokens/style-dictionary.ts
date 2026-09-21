import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'stylex/variables',
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .filter((token) => typeof token.$value === 'string' || typeof token.$value === 'number')
      .map((token) => `  ${token.name}: ${JSON.stringify(token.$value)},`);

    return [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
      "import * as stylex from '@stylexjs/stylex';",
      '',
      'export const vars = stylex.defineVars({',
      ...vars,
      '});',
      '',
    ].join('\n');
  },
});

const styleDictionary = new StyleDictionary({
  source: ['src/tokens/tokens.json'],

  platforms: {
    tokens: {
      transformGroup: 'js',
      buildPath: 'src/tokens/generated/',
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

styleDictionary.buildAllPlatforms();
