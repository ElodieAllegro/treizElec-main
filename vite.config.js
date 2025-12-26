import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        realisations: 'realisations.html',
        contact: 'contact.html',
        mentionsLegales: 'mentions-legales.html',
        cgv: 'cgv.html',
        infosUtiles: 'infos-utiles.html'
      }
    }
  }
});