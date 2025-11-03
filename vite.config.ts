// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@json_data': path.resolve(__dirname, './json_data'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'umd', // or 'iife'
        name: 'MyApp', // Required for UMD/IIFE; give your app a global name
      },
    },
  },
});
