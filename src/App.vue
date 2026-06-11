<script setup>
import { ref } from 'vue'

const isPixModalOpen = ref(false)

// Buscando chaves seguras do .env
const chavePix = import.meta.env.VITE_PIX_KEY
const linkQrCode = import.meta.env.VITE_PIX_QRCODE

const copyPix = async () => {
  try {
    if (!chavePix) return alert("Chave PIX não configurada no servidor!")
    await navigator.clipboard.writeText(chavePix)
    alert("Chave PIX copiada com sucesso! Agora é só colar no app do seu banco.")
  } catch (err) {
    alert("Erro ao copiar chave.")
  }
}
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative bg-fundo overflow-hidden">
    
    <svg class="absolute top-0 left-0 w-56 h-56 opacity-[0.12] text-[#5B6342] pointer-events-none md:hidden -translate-x-16 -translate-y-12 rotate-45 z-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
    </svg>

    <svg class="absolute bottom-0 right-0 w-64 h-64 opacity-[0.12] text-[#8B9467] pointer-events-none md:hidden translate-x-12 translate-y-20 -rotate-180 z-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
    </svg>
    <div class="relative z-10">
      
      <header class="text-center mb-16 max-w-5xl mx-auto px-4 pt-32">
        <h1 class="text-4xl md:text-6xl font-serif text-[#5B6342] font-bold tracking-tight">
          Chá de Casa Nova
        </h1>
        
        <div class="mt-6 space-y-3 text-lg text-[#A07855] font-medium leading-relaxed max-w-2xl mx-auto">
          <p>Estamos montando nosso lar e reunimos aqui alguns itens que ficaríamos muito felizes&nbsp;em&nbsp;ganhar.</p>
          <p>Caso prefira, também aceitamos um PIX de qualquer valor para nos ajudar nessa nova fase. 🏡✨</p>
        </div>

        <button 
          @click="isPixModalOpen = true"
          class="mt-8 inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm text-[#8B9467] font-bold text-lg py-3 px-8 rounded-full shadow-sm border border-[#8B9467]/30 hover:border-[#8B9467] hover:shadow-md transition-all hover:-translate-y-1"
        >
          <span class="text-2xl">✨</span> Presentear com PIX
        </button>
      </header>

      <main class="max-w-7xl mx-auto mb-32">
        <router-view />
      </main>

    </div>

    <div v-if="isPixModalOpen" class="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white border border-stone-100 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative overflow-hidden">
        
        <svg class="absolute -bottom-8 -left-8 w-40 h-40 opacity-[0.05] text-[#5B6342] pointer-events-none rotate-45" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>

        <button @click="isPixModalOpen = false" class="absolute top-5 right-5 text-stone-300 hover:text-stone-500 font-bold text-xl transition-colors z-10">✕</button>
        <h2 class="text-3xl font-serif font-bold text-[#5B6342] mb-2 relative z-10">Nosso PIX</h2>
        <p class="text-stone-500 mb-6 text-sm relative z-10">Escaneie o QR Code ou copie a chave:</p>
        
        <div class="w-48 h-48 mx-auto bg-white rounded-xl mb-6 p-2 border border-stone-100 shadow-inner flex items-center justify-center relative z-10">
          <img v-if="linkQrCode" :src="linkQrCode" alt="QR Code PIX" class="w-full h-full object-contain" />
          <span v-else class="text-xs text-stone-400">QR Code não configurado</span>
        </div>
        
        <div class="bg-[#F5F2E9] border border-stone-200 rounded-xl p-4 mb-6 relative z-10">
          <span class="text-[#A07855] font-mono text-sm font-bold select-all">{{ chavePix || 'Não configurada' }}</span>
        </div>
        
        <button @click="copyPix" class="w-full bg-[#8B9467] hover:brightness-105 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#8B9467]/20 relative z-10">
          Copiar Chave PIX
        </button>
      </div>
    </div>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@700&display=swap');

.bg-fundo {
  background-color: #F5F2E9; 
  background-image: url('/fundo-site.jpg');
  background-size: cover; 
  background-position: top center; 
  background-attachment: fixed; 
}

body { 
  margin: 0; 
  font-family: 'Inter', sans-serif; 
}

h1, h2, h3, .font-serif {
  font-family: 'Lora', serif;
}
</style>