<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <header>
    <RouterLink to="/">
      <img alt="Vue logo" class="logo" src="../public/favicon.ico" width="125" height="125" />
    </RouterLink>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/liveview">Live</RouterLink>
      <RouterLink to="/sampleview">Sample</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #24292f;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 9vh;
  z-index: 1000;
}

main {
  padding-top: 7vh;
}

.logo {
  height: 40px;
  width: auto;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  text-decoration: none;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

nav a:hover {
  background-color: #0366d6;
}

nav a.router-link-exact-active {
  color: rgb(214, 161, 3);
}
</style>
