import type { FormatFn } from 'style-dictionary/types';

export const stylexTokensFormat: FormatFn = ({ dictionary }) => {
  const sets: Record<string, Record<string, string>> = {};

  for (const token of dictionary.allTokens) {
    if (token.$extensions?.['com.figma.type'] === 'boolean') {
      continue;
    }

    const [set, ...path] = token.path;
    let value: string;

    if (!sets[set]) {
      sets[set] = {};
    }

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

    sets[set][path.join('')] = value;
  }

  return [
    '/**',
    ' * Do not edit directly, this file was auto-generated.',
    ' */',
    '',
    'import * as stylex from "@stylexjs/stylex";',
    '',
    Object.entries(sets)
      .map(([name, values]) => {
        return `export const ${name} = stylex.defineVars(${JSON.stringify(values, null, 2)})`;
      })
      .join('\n\n'),
    '',
  ].join('\n');
};
