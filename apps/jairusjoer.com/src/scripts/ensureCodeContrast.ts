const codeContrast: Record<string, string> = {
  '#1E754F': '#1A6644',
  '#2E8F82': '#1D6B60',
  '#2F798A': '#27677A',
  '#59873A': '#3C6E23',
  '#998418': '#6D5E12',
  '#999999': '#5E5E5E',
  '#A0ADA0': '#576557',
  '#A65E2B': '#8A521C',
  '#AB5959': '#8F3F3F',
  '#B07D48': '#7D5A2A',
  '#B56959': '#96453B',
  '#4D9375': '#5CAE87',
  '#666666': '#969696',
  '#6B786A': '#8FA08F',
  '#758575DD': '#97A797DD',
};

export const ensureCodeContrast = {
  name: 'ensure-code-contrast',
  span(node: { properties?: Record<string, unknown> }) {
    const { properties } = node;
    if (properties && typeof properties.style === 'string') {
      properties.style = (properties.style as string).replace(
        /#[0-9a-f]{6}(?:[0-9a-f]{2})?\b/gi,
        (hex) => codeContrast[hex.toUpperCase()] ?? hex,
      );
    }
  },
};
