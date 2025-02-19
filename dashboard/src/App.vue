<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/live">Live</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  /* Espacer le logo et les liens de navigation */
  align-items: center;
  padding: 1rem 2rem;
  background-color: #24292f;
  color: white;
  position: fixed;
  /* Rendre le menu fixe en haut de la page */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  /* Assurer que le menu soit toujours visible au-dessus des autres éléments */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Ombre subtile sous le menu */
}

.logo {
  height: 30px;
  /* Taille plus petite pour le logo */
  width: auto;
}

nav {
  display: flex;
  /* Met en ligne les liens du menu */
  gap: 1.5rem;
  /* Espacement entre les liens */
}

nav a {
  text-decoration: none;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  /* Un peu de padding pour les liens */
  border-radius: 4px;
  /* Bords légèrement arrondis */
  transition: background-color 0.3s ease;
  /* Effet doux lors du survol */
}

nav a:hover {
  background-color: #0366d6;
}


nav a.router-link-exact-active {
  color: rgb(214, 161, 3);
}

main {
  padding-top: 70px;
}
</style>
