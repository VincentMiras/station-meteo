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
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.box {
  position: relative;
  text-align: center;
  color: white;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  width: 440px;
  height: 440px;
}

.box img {
  width: 100%;
  height: auto;
}

.box p {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
}
.title {
  text-align: center;
  margin-top: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
}

.title h1 {
  font-size: 2rem;
  color: #333;
  font-family: 'Arial', sans-serif;
}
</style>
