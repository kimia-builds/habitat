// 'vitest/config' understands both Vite's build options and Vitest's
// test options, so one file configures both.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site lives at https://kimia-builds.github.io/habitat (a subfolder,
  // not a root domain), so all asset links must start with /habitat/.
  base: '/habitat/',
  // The dev server takes its port from the PORT variable when one is
  // set (Claude Code's browser preview assigns one so two sessions can
  // run side by side); otherwise Vite's usual 5173.
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  test: {
    // Tests simulate a browser (jsdom) so components can render in them.
    environment: 'jsdom',
    // Repairs the test sandbox's localStorage (see the file's comments).
    setupFiles: ['./src/test/setup.js'],
  },
})
