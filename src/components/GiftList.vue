<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'

const gifts = ref([])
const selectedGift = ref(null)
const isModalOpen = ref(false)
const isReservedStep = ref(false)
const giftsCollection = collection(db, 'gifts')

onMounted(() => {
  onSnapshot(giftsCollection, (snapshot) => {
    const loadedGifts = []
    snapshot.forEach((doc) => {
      loadedGifts.push({ id: doc.id, ...doc.data() })
    })
    gifts.value = loadedGifts
  })
})

const formatUrl = (url) => {
  if (!url) return '#'
  return url.startsWith('http') ? url : `https://${url}`
}

const openModal = (gift, isAlreadyReserved = false) => {
  selectedGift.value = gift
  isModalOpen.value = true
  isReservedStep.value = isAlreadyReserved 
}

const confirmReservation = async () => {
  const giftRef = doc(db, 'gifts', selectedGift.value.id)
  await updateDoc(giftRef, { reserved: true })
  isReservedStep.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedGift.value = null
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="gift in gifts" :key="gift.id" 
        class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col relative"
        :class="{ 'opacity-80 grayscale-[0.3]': gift.reserved }"
      >
        <div class="aspect-video w-full overflow-hidden bg-white relative border-b border-stone-50">
          <img :src="gift.image" :alt="gift.name" class="w-full h-full object-contain p-4" />
          <div v-if="gift.reserved" class="absolute inset-0 bg-[#5B6342]/20 flex items-center justify-center pointer-events-none">
            <span class="bg-white text-[#5B6342] px-4 py-2 rounded-full font-bold text-sm shadow-lg">🔒 Reservado</span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow relative z-10">
          <h3 class="text-xl font-bold text-[#5B6342] mb-2">{{ gift.name }}</h3>
          <p class="text-lg font-bold text-[#A07855] mb-5">{{ gift.price }}</p>
          
          <button 
            v-if="!gift.reserved" @click="openModal(gift, false)"
            class="mt-auto w-full bg-[#8B9467] hover:brightness-95 text-white font-bold py-3 rounded-xl transition-all shadow-sm"
          >
            Dar este presente
          </button>
          
          <button 
            v-else @click="openModal(gift, true)" 
            class="mt-auto w-full bg-stone-100 hover:bg-stone-200 text-[#5B6342] font-bold py-3 rounded-xl transition-all border border-stone-200"
          >
            🔒 Já garantido (Ver links)
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white border border-stone-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
        
        <svg class="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.06] text-[#5B6342] pointer-events-none -rotate-12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>

        <div v-if="!isReservedStep" class="relative z-10">
          <h2 class="text-3xl font-serif font-bold text-[#5B6342] mb-4 text-center">Que alegria!</h2>
          <div class="w-full h-40 mb-6 rounded-2xl overflow-hidden border border-stone-50 bg-[#F5F2E9]/30">
            <img :src="selectedGift.image" :alt="selectedGift.name" class="w-full h-full object-contain p-4" />
          </div>
          <p class="text-stone-600 mb-8 text-center">Você escolheu nos presentear com:<br>
            <strong class="text-[#5B6342] text-xl block mt-1">{{ selectedGift.name }}</strong>
          </p>
          <div class="flex gap-4">
            <button @click="closeModal" class="flex-1 px-4 py-4 bg-white text-stone-400 border border-stone-200 rounded-2xl font-bold transition-colors">Voltar</button>
            <button @click="confirmReservation" class="flex-1 px-4 py-4 bg-[#8B9467] text-white rounded-2xl font-bold shadow-lg shadow-[#8B9467]/20">Confirmar</button>
          </div>
        </div>

        <div v-else class="text-center relative z-10">
          <div class="w-16 h-16 bg-[#8B9467]/10 text-[#8B9467] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎁</div>
          <h2 class="text-2xl font-serif font-bold text-[#5B6342] mb-3">Sugestões de Compra</h2>
          
          <p class="text-stone-600 mb-6 text-sm leading-relaxed">
            Disponibilizamos alguns links apenas como sugestão de compra. Fique à vontade para adquirir o presente na loja de sua preferência.
          </p>

          <div class="flex flex-col gap-3">
            <a v-for="(link, index) in selectedGift.links" :key="index" :href="formatUrl(link.url)" target="_blank"
              class="block w-full py-4 px-6 bg-white text-stone-700 border border-stone-100 rounded-2xl font-bold hover:bg-[#F5F2E9] hover:text-[#5B6342] transition-all text-left flex justify-between items-center shadow-sm"
            >
              Comprar na {{ link.store }} <span class="text-xl">➔</span>
            </a>
          </div>
          
          <button @click="closeModal" class="mt-8 text-stone-400 hover:text-stone-600 underline font-medium transition-colors">Fechar aba</button>
        </div>
      </div>
    </div>
  </div>
</template>