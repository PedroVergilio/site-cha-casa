<script setup>
import { ref } from 'vue'

// === CONFIGURAÇÕES DO PIX ===
const isPixModalOpen = ref(false)

// 1. Coloque a sua chave PIX real aqui dentro das aspas:
const chavePix = "sua-chave-pix@email.com" 

// 2. Coloque o link da imagem do seu QR Code aqui:
// (Você pode gerar no app do seu banco, salvar a imagem e pegar o link)
const linkQrCode = "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 

const copyPix = async () => {
  try {
    await navigator.clipboard.writeText(chavePix)
    alert("Chave PIX copiada com sucesso! Agora é só colar no app do seu banco.")
  } catch (err) {
    alert("Erro ao copiar chave. Por favor, selecione e copie manualmente.")
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#EAE8E3] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative">
    
    <header class="text-center mb-16 max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-serif text-[#D7A49A] font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
        Nosso Chá de Casa Nova
      </h1>
      
      <div class="mt-6 space-y-3 text-lg text-[#D7A49A] font-medium leading-relaxed">
        <p>Estamos montando nosso lar e reunimos aqui alguns itens que ficaríamos muito felizes em ganhar.</p>
        <p>Caso prefira, também aceitamos um PIX de qualquer valor para nos ajudar nessa nova fase. 🏡✨</p>
      </div>

      <button 
        @click="isPixModalOpen = true"
        class="mt-8 inline-flex items-center gap-3 bg-white text-[#A7B59D] font-bold text-lg py-3 px-8 rounded-full shadow-sm border border-stone-200 hover:border-[#A7B59D] hover:shadow-md transition-all hover:-translate-y-1"
      >
        <span class="text-2xl">✨</span> Presentear com PIX
      </button>
    </header>

    <main class="max-w-7xl mx-auto relative z-10">
      <router-view />
    </main>

    <div v-if="isPixModalOpen" class="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white border border-stone-100 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative">
        <button @click="isPixModalOpen = false" class="absolute top-5 right-5 text-stone-400 hover:text-stone-600 font-bold text-xl transition-colors">✕</button>
        
        <h2 class="text-3xl font-serif font-bold text-[#D7A49A] mb-2">Nosso PIX</h2>
        <p class="text-stone-600 mb-6 text-sm">Escaneie o QR Code ou copie a chave abaixo:</p>
        
        <div class="w-48 h-48 mx-auto bg-white rounded-xl mb-6 p-2 border border-stone-200 shadow-inner flex items-center justify-center">
          <img :src="linkQrCode" alt="QR Code PIX" class="w-full h-full object-contain" />
        </div>

        <div class="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6 flex items-center justify-center">
          <span class="text-stone-700 font-mono text-sm font-semibold select-all">{{ chavePix }}</span>
        </div>

        <button 
          @click="copyPix"
          class="w-full bg-[#A7B59D] hover:brightness-105 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#A7B59D]/20 flex items-center justify-center gap-2"
        >
          Copiar Chave PIX
        </button>
      </div>
    </div>

  </div>
</template>

<style>
body {
  background-color: #EAE8E3;
  margin: 0;
  font-family: sans-serif;
}
</style>