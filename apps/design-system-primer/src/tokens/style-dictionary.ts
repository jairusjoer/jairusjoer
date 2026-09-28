import StyleDictionary from 'style-dictionary';

StyleDictionary.registerFormat({
  name: 'stylex/variables',
  format: ({ dictionary }) => {
    const lines: string[] = [];

    for (const token of dictionary.allTokens) {
      lines.push(`  ${token.name}: '${token.$value}',`);
    }

    return [
      '/**',
      ' * Do not edit directly, this file was auto-generated.',
      ' */',
      '',
      "import * as stylex from '@stylexjs/stylex';",
      '',
      'export const vars = stylex.defineVars({',
      ...lines,
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
