import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclure les modules problématiques si nécessaire
  },
  resolve: {
    alias: {
      '@': '/src', // Alias pour simplifier les imports (facultatif)
    },
  },
  server: {
    port: 3000, // Définir le port de développement (par défaut : 5173)
    open: true, // Ouvrir le navigateur automatiquement
  },
  build: {
    sourcemap: true, // Activer les sourcemaps pour le débogage
    outDir: 'dist', // Répertoire de sortie
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Assure la prise en charge de JSX si nécessaire
  },
  logLevel: 'info', // Niveau des logs pour faciliter le débogage
});

console.log("Vite config loaded successfully");