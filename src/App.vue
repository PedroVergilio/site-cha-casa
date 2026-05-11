<script setup>
import GiftList from './components/GiftList.vue'
</script>

<template>
  <div class="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
    <header class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-serif text-stone-800 font-bold tracking-tight">Nosso Chá de Casa Nova</h1>
      <p class="mt-4 text-lg text-stone-600">Com muito carinho, estamos montando nosso lar. Escolha um item abaixo para nos presentear!</p>
    </header>

    <main class="max-w-7xl mx-auto">
      <GiftList />
    </main>
  </div>
</template>