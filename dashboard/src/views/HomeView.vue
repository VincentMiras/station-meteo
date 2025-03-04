<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLiveView = () => {
  router.push('/liveview')
}

const goToSampleView = () => {
  router.push('/sampleview')
}
</script>

<template>
  <main>
    <TheWelcome />
    <div class="title">
      <h1>Dashboard de la station météo 31</h1>
    </div>
    <div class="container">
      <div class="box" @click="goToLiveView">
        <img src="@/assets/live.jpg" alt="Live View" />
        <p>Live View</p>
      </div>
      <div class="box" @click="goToSampleView">
        <img src="@/assets/sample.png" alt="Sample View" />
        <p>Sample View</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.box {
  position: relative;
  text-align: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  max-width: 440px;
  height: auto;
  aspect-ratio: 1;
  transition: transform 0.3s, box-shadow 0.3s;
}

.box:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.box p {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(24, 184, 195, 0.95);
  padding: 5px 10px;
  border-radius: 10px;
}

.title {
  text-align: center;
  margin-top: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  font-family: 'Poppins', sans-serif;
  background-color: #47c3ed3b; 
}

.title h1 {
  font-size: 2.5rem;
  color: #333333;
  font-family: 'Poppins', sans-serif; 
}

@media (max-width: 768px) {
  .box {
    width: 100%;
    max-width: 300px;
  }

  .title h1 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .box {
    width: 100%;
    max-width: 200px;
  }

  .title h1 {
    font-size: 1.5rem;
  }
}
</style>
