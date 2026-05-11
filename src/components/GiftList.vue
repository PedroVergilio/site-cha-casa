<script setup>
import { ref } from 'vue'

// 1. O TERRENO PREPARADO (Mock Data)
// Aqui você e sua esposa vão colocar os itens reais depois.
// No futuro, essa lista virá do Firebase!
const gifts = ref([
  {
    id: 1,
    name: "Jogo de Panelas Antiaderente",
    price: "R$ 450,00",
    image: "https://images.unsplash.com/photo-1584990347449-a16bf14800e2?q=80&w=600&auto=format&fit=crop",
    link: "https://www.magazineluiza.com.br/...",
    reservedBy: null // Se tiver nome, está bloqueado
  },
  {
    id: 2,
    name: "Liquidificador Oster",
    price: "R$ 220,00",
    image: "https://images.unsplash.com/photo-1585237832863-718252277d54?q=80&w=600&auto=format&fit=crop",
    link: "https://www.amazon.com.br/...",
    reservedBy: "Tia Maria" // Exemplo de item já reservado
  },
  {
    id: 3,
    name: "Faqueiro Inox 72 Peças",
    price: "R$ 180,00",
    image: "https://images.unsplash.com/photo-1590322744743-34e8590c1f51?q=80&w=600&auto=format&fit=crop",
    link: "https://www.mercadolivre.com.br/...",
    reservedBy: null
  }
])

// Variáveis para controlar a janela (modal) de reserva
const selectedGift = ref(null)
const guestName = ref('')
const isModalOpen = ref(false)

// 2. FUNÇÕES DE AÇÃO
const openModal = (gift) => {
  selectedGift.value = gift
  isModalOpen.value = true
}

const confirmReservation = () => {
  if (!guestName.value) {
    alert("Por favor, digite seu nome!")
    return
  }

  // AQUI ENTRARÁ O FIREBASE NO FUTURO
  // Simulando a reserva localmente:
  const index = gifts.value.findIndex(g => g.id === selectedGift.value.id)
  gifts.value[index].reservedBy = guestName.value
  
  // Salva o link antes de fechar o modal
  const linkToBuy = selectedGift.value.link
  
  // Limpa e fecha o modal
  isModalOpen.value = false
  guestName.value = ''
  selectedGift.value = null

  // Redireciona o convidado para a loja
  window.open(linkToBuy, '_blank')
}
</script>

<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <div 
        v-for="gift in gifts" 
        :key="gift.id" 
        class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-stone-100 flex flex-col"
        :class="{ 'opacity-60 grayscale': gift.reservedBy }"
      >
        <div class="aspect-video w-full overflow-hidden bg-stone-100 relative">
          <img :src="gift.image" :alt="gift.name" class="w-full h-full object-cover" />
          
          <div v-if="gift.reservedBy" class="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span class="bg-white text-stone-800 px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
              🔒 Escolhido por {{ gift.reservedBy }}
            </span>
          </div>
        </div>

        <div class="p-6 flex flex-col flex-grow">
          <h3 class="text-xl font-semibold text-stone-800 mb-2">{{ gift.name }}</h3>
          <p class="text-stone-500 font-medium mb-6">{{ gift.price }}</p>
          
          <button 
            v-if="!gift.reservedBy"
            @click="openModal(gift)"
            class="mt-auto w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
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

    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <h2 class="text-2xl font-serif font-bold text-stone-800 mb-4">Que alegria!</h2>
        <p class="text-stone-600 mb-6">
          Você escolheu nos presentear com: <br>
          <strong class="text-stone-800">{{ selectedGift.name }}</strong>
        </p>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-stone-700 mb-2">Seu nome e sobrenome</label>
          <input 
            v-model="guestName" 
            type="text" 
            placeholder="Ex: Tio João e Tia Maria" 
            class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          >
        </div>

        <p class="text-xs text-stone-500 mb-6">
          Ao confirmar, esse item ficará bloqueado na lista para outras pessoas e você será redirecionado para a loja onde pode comprá-lo.
        </p>

        <div class="flex gap-4">
          <button 
            @click="isModalOpen = false"
            class="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl font-medium hover:bg-stone-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="confirmReservation"
            class="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Confirmar e Comprar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>