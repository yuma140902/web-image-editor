import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import * as child from 'child_process';

const commitId = child.execSync('git rev-parse --short HEAD').toString();
const branch = child.execSync('git rev-parse --abbrev-ref HEAD').toString();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/web-image-editor/',
  define: {
    __COMMIT_ID__: JSON.stringify(commitId.trim()),
    __GIT_BRANCH__: JSON.stringify(branch.trim()),
  },
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=86400; includeSubDomains', // Adds HSTS options to your website, with a expiry time of 1 day
      'X-Content-Type-Options': 'nosniff', // Protects from improper scripts runnings
      'X-Frame-Options': 'DENY', // Stops your site being used as an iframe
      'X-XSS-Protection': '1; mode=block', // Gives XSS protection to legacy browsers
    },
  },
});
