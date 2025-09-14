import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

const Preset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#e6f2ff',
      100: '#cce5ff',
      200: '#99ccff',
      300: '#66b3ff',
      400: '#3399ff',
      500: '#007fff',
      600: '#0066cc',
      700: '#004c99',
      800: '#003366',
      900: '#001933',
      950: '#000d1a',
    },
  },
});

export default Preset;
