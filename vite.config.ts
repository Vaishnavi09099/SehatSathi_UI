import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const plugins = [react(),tailwindcss()];

  if (process.env.ANALYZE === 'true') {
    plugins.push(
      // generate stats.html in the dist folder
      visualizer({ filename: './dist/bundle-analysis.html', open: false, gzipSize: true }) as any,
    );
  }

  return {
    plugins,
  };
});
