<script setup>
import GiftList from './components/GiftList.vue'
</script>

<template>
  <div class="min-h-screen bg-[#EAE8E3] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
    <header class="text-center mb-16 max-w-2xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-serif text-[#D7A49A] font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        Nosso Chá de Casa Nova
      </h1>
      <p class="mt-4 text-lg text-[#D7A49A] font-medium">
        Com muito carinho, estamos montando nosso lar.
      </p>
    </header>

    <main class="max-w-7xl mx-auto">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Garante que o fundo do navegador acompanhe a cor Açúcar Cristal */
body {
  background-color: #EAE8E3;
  margin: 0;
  font-family: sans-serif;
}
</style>