<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

const name = ref('')
const price = ref('')
const image = ref('')
const links = ref([{ store: '', url: '' }])

// Lista de presentes que vai aparecer no painel para exclusão
const gifts = ref([])
const giftsCollection = collection(db, 'gifts')

// 1. ESCUTAR OS PRESENTES EM TEMPO REAL NO ADMIN
onMounted(() => {
  onSnapshot(giftsCollection, (snapshot) => {
    const loadedGifts = []
    snapshot.forEach((doc) => {
      loadedGifts.push({ id: doc.id, ...doc.data() })
    })
    gifts.value = loadedGifts
  })
})

const addLinkField = () => {
  links.value.push({ store: '', url: '' })
}

const removeLinkField = (index) => {
  links.value.splice(index, 1)
}

// 2. FUNÇÃO PARA SALVAR
const saveGift = async () => {
  if (!name.value || !price.value) return alert("Preencha ao menos nome e preço!")
  
  try {
    await addDoc(giftsCollection, {
      name: name.value,
      price: price.value,
      image: image.value || 'https://images.unsplash.com/photo-1556911220-e150213ff7ad?q=80&w=800',
      links: links.value.filter(l => l.store && l.url),
      reserved: false
    })
    alert("Presente cadastrado com sucesso!")
    name.value = ''; price.value = ''; image.value = ''; links.value = [{ store: '', url: '' }]
  } catch (e) {
    alert("Erro ao salvar: " + e.message)
  }
}

// 3. FUNÇÃO MÁGICA PARA DELETAR
const deleteGift = async (id, giftName) => {
  const confirmacao = confirm(`Tem certeza que deseja remover "${giftName}" da lista?`)
  if (!confirmacao) return

  try {
    // Aponta exatamente para o documento do presente e deleta
    await deleteDoc(doc(db, 'gifts', id))
    alert("Presente removido com sucesso!")
  } catch (e) {
    alert("Erro ao remover: " + e.message)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-12">
    
    <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <h2 class="text-3xl font-serif font-bold text-[#D7A49A] mb-6">Cadastrar Novo Presente</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-stone-700 mb-1">Nome do Item</label>
          <input v-model="name" type="text" placeholder="Ex: Batedeira Planetária" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D]">
        </div>

        <div>
          <label class="block text-sm font-medium text-stone-700 mb-1">Preço Sugerido (Texto)</label>
          <input v-model="price" type="text" placeholder="Ex: R$ 350,00" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D]">
        </div>

        <div>
          <label class="block text-sm font-medium text-stone-700 mb-1">URL da Imagem</label>
          <input v-model="image" type="text" placeholder="Link da foto do produto" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D]">
        </div>

        <div class="pt-4 border-t border-stone-100">
          <h3 class="font-bold text-stone-800 mb-3">Links das Lojas</h3>
          <div v-for="(link, index) in links" :key="index" class="flex gap-2 mb-2">
            <input v-model="link.store" placeholder="Loja (ex: Amazon)" class="flex-1 p-3 rounded-xl border border-stone-200 outline-none">
            <input v-model="link.url" placeholder="Link (http://...)" class="flex-[2] p-3 rounded-xl border border-stone-200 outline-none">
            <button @click="removeLinkField(index)" class="text-red-400 px-2">✕</button>
          </div>
          <button @click="addLinkField" class="text-[#A7B59D] font-bold text-sm">+ Adicionar outra loja</button>
        </div>

        <button @click="saveGift" class="w-full bg-[#A7B59D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#A7B59D]/20 hover:brightness-95 transition-all mt-6">
          Salvar Presente na Lista
        </button>
        
        <router-link to="/" class="block text-center text-stone-400 text-sm mt-4 underline">Voltar para a lista pública</router-link>
      </div>
    </div>

    <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <h2 class="text-2xl font-serif font-bold text-stone-800 mb-6">Presentes Atuais ({{ gifts.length }})</h2>
      
      <div v-if="gifts.length === 0" class="text-stone-400 text-center py-6">
        Nenhum presente cadastrado ainda. O banco está zerado!
      </div>

      <div v-else class="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-2">
        <div v-for="gift in gifts" :key="gift.id" class="py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img :src="gift.image" :alt="gift.name" class="w-12 h-12 rounded-lg object-cover bg-stone-100 shadow-sm" />
            <div>
              <h4 class="font-bold text-stone-800 line-clamp-1">{{ gift.name }}</h4>
              <p class="text-sm text-stone-500">{{ gift.price }} <span v-if="gift.reserved" class="text-amber-600 font-medium ml-2">(Reservado 🔒)</span></p>
            </div>
          </div>
          
          <button 
            @click="deleteGift(gift.id, gift.name)" 
            class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Remover
          </button>
        </div>
      </div>
    </div>

  </div>
</template>