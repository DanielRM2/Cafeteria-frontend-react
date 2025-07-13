import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['urbancoffee.loca.lt'],
  },
  build: {
    outDir: 'dist', // Asegúrate que esta sea la carpeta subida
  }
});