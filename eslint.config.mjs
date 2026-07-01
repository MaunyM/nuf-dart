import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...coreWebVitals,
  {
    rules: {
      // New rule in eslint-plugin-react-hooks v5 — pre-existing pattern, to be addressed separately
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];

export default config;
