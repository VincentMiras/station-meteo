<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/live">Live</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between; /* Espacer le logo et les liens de navigation */
  align-items: center; /* Centrer verticalement le contenu */
  padding: 1rem 2rem; /* Espacement intérieur */
  background-color: #24292f; /* Fond sombre comme Stack Overflow */
  color: white; /* Couleur des textes en blanc */
  position: fixed; /* Rendre le menu fixe en haut de la page */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Assurer que le menu soit toujours visible au-dessus des autres éléments */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre subtile sous le menu */
}

.logo {
  height: 40px; /* Taille plus petite pour le logo */
  width: auto;
}

nav {
  display: flex; /* Met en ligne les liens du menu */
  gap: 1.5rem; /* Espacement entre les liens */
}

nav a {
  text-decoration: none; /* Enlever le soulignement par défaut */
  color: white; /* Couleur des liens en blanc */
  font-size: 14px;
  padding: 8px 12px; /* Un peu de padding pour les liens */
  border-radius: 4px; /* Bords légèrement arrondis */
  transition: background-color 0.3s ease; /* Effet doux lors du survol */
}

nav a:hover {
  background-color: #0366d6; /* Changement de couleur de fond au survol (similaire à Stack Overflow) */
}

nav a.router-link-exact-active {
  color: #0366d6; /* Met en surbrillance le lien actif */
}

@media (min-width: 1024px) {
  header {
    padding: 1rem 3rem; /* Augmenter le padding sur les grands écrans */
  }

  nav {
    font-size: 16px; /* Taille du texte augmentée pour les grands écrans */
  }
}
</style>
