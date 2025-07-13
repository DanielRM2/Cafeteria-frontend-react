import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const base = mode === 'prod' ? '/react-cafeteria/' : '/';

  return {
    plugins: [react()],
    base,
    server: {
      port: 5173,
      allowedHosts: ['urbancoffee.loca.lt'],
    },
  };
});
