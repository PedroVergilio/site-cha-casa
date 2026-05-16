<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'

const gifts = ref([])
const selectedGift = ref(null)
const isModalOpen = ref(false)
const isReservedStep = ref(false)
const giftsCollection = collection(db, 'gifts')

// 1. ESCUTAR O BANCO EM TEMPO REAL
onMounted(() => {
  onSnapshot(giftsCollection, (snapshot) => {
    const loadedGifts = []
    snapshot.forEach((doc) => {
      loadedGifts.push({ id: doc.id, ...doc.data() })
    })
    gifts.value = loadedGifts
  })
})

// Função que garante que o link sempre tenha https://
const formatUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `https://${url}`
}

// 3. ATUALIZAR RESERVA NO FIREBASE
const openModal = (gift) => {
  selectedGift.value = gift
  isModalOpen.value = true
  isReservedStep.value = false 
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
        v-for="gift in gifts" 
        :key="gift.id" 
        class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col"
        :class="{ 'opacity-60 grayscale': gift.reserved }"
      >
        <div class="aspect-video w-full overflow-hidden bg-stone-100 relative">
          <img :src="gift.image" :alt="gift.name" class="w-full h-full object-cover" />
          
          <div v-if="gift.reserved" class="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
            <span class="bg-white text-stone-800 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              🔒 Presente Reservado
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow bg-white">
          <h3 class="text-xl font-semibold text-stone-800 mb-2">{{ gift.name }}</h3>
          <p class="text-lg font-bold text-stone-600 mb-5">{{ gift.price }}</p>
          
          <button 
            v-if="!gift.reserved"
            @click="openModal(gift)"
            class="mt-auto w-full bg-[#A7B59D] hover:brightness-95 text-white font-medium py-3 rounded-xl transition-all shadow-sm"
          >
            Dar este presente
          </button>
          
          <button 
            v-else
            disabled
            class="mt-auto w-full bg-stone-200 text-stone-500 font-medium py-3 rounded-xl cursor-not-allowed"
          >
            Já garantido!
          </button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-stone-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        
        <div v-if="!isReservedStep">
          <h2 class="text-3xl font-serif font-bold text-[#D7A49A] mb-4 text-center">Que alegria!</h2>
          
          <div class="w-full h-48 mb-6 rounded-2xl overflow-hidden border border-stone-100 shadow-inner bg-stone-50">
            <img 
              :src="selectedGift.image" 
              :alt="selectedGift.name" 
              class="w-full h-full object-contain p-2"
            />
          </div>

          <p class="text-[#4A423C] mb-8 text-center text-lg">
            Você escolheu nos presentear com: <br>
            <strong class="text-[#4A423C] text-xl font-serif mt-1 inline-block">{{ selectedGift.name }}</strong>
          </p>

          <div class="flex gap-4">
            <button 
              @click="closeModal"
              class="flex-1 px-4 py-4 bg-white text-stone-400 border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-colors"
            >
              Voltar
            </button>
            <button 
              @click="confirmReservation"
              class="flex-1 px-4 py-4 bg-[#A7B59D] hover:brightness-105 text-white rounded-2xl font-bold transition-all shadow-lg shadow-[#A7B59D]/20"
            >
              Confirmar
            </button>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="w-16 h-16 bg-[#A7B59D]/10 text-[#A7B59D] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm border border-[#A7B59D]/20">
            ✓
          </div>
          <h2 class="text-2xl font-serif font-bold text-stone-800 mb-2">Reserva Confirmada!</h2>
          <p class="text-stone-600 mb-6">
            Muito obrigado! O item já foi bloqueado na lista. Agora, escolha onde prefere comprar:
          </p>

          <div class="flex flex-col gap-3">
            <a 
              v-for="(link, index) in selectedGift.links" 
              :key="index"
              :href="formatUrl(link.url)" 
              target="_blank"
              class="block w-full py-3 px-4 bg-white text-stone-700 border border-stone-200 rounded-xl font-medium hover:bg-stone-50 hover:text-[#A7B59D] hover:border-[#A7B59D] transition-all text-left flex justify-between items-center shadow-sm"
              >
              Comprar na {{ link.store }}
              <span class="text-xl">➔</span>
            </a>
          </div>

          <button 
            @click="closeModal"
            class="mt-6 text-stone-500 hover:text-stone-700 font-medium underline transition-colors"
          >
            Fechar e voltar para a lista
          </button>
        </div>

      </div>
    </div>

  </div>
</template>