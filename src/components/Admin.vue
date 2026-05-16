<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

// === LÓGICA DE LOGIN ===
const isAuthenticated = ref(false)
const passwordInput = ref('')
const errorMessage = ref('')

// Verifica se a pessoa já logou antes
onMounted(() => {
  if (sessionStorage.getItem('admin_auth') === 'true') {
    isAuthenticated.value = true
  }
})

const checkPassword = () => {
  // Compara o que a pessoa digitou com a senha do arquivo .env
  if (passwordInput.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    isAuthenticated.value = true
    sessionStorage.setItem('admin_auth', 'true') // Salva o login na sessão atual
  } else {
    errorMessage.value = 'Senha incorreta! Xô, penetra! 🛑'
    passwordInput.value = ''
  }
}

const logout = () => {
  isAuthenticated.value = false
  sessionStorage.removeItem('admin_auth')
}

// === LÓGICA DO BANCO DE DADOS (Inalterada) ===
const name = ref('')
const price = ref('')
const image = ref('')
const links = ref([{ store: '', url: '' }])
const gifts = ref([])
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

const addLinkField = () => { links.value.push({ store: '', url: '' }) }
const removeLinkField = (index) => { links.value.splice(index, 1) }

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

const deleteGift = async (id, giftName) => {
  const confirmacao = confirm(`Tem certeza que deseja remover "${giftName}" da lista?`)
  if (!confirmacao) return
  try {
    await deleteDoc(doc(db, 'gifts', id))
    alert("Presente removido com sucesso!")
  } catch (e) {
    alert("Erro ao remover: " + e.message)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    
    <div v-if="!isAuthenticated" class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 max-w-sm mx-auto mt-20">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-[#A7B59D]/10 text-[#A7B59D] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h2 class="text-2xl font-serif font-bold text-stone-800">Acesso Restrito</h2>
        <p class="text-stone-500 text-sm mt-2">Área exclusiva dos noivos</p>
      </div>

      <div class="space-y-4">
        <div>
          <input 
            v-model="passwordInput" 
            @keyup.enter="checkPassword"
            type="password" 
            placeholder="Digite a senha..." 
            class="w-full p-4 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D] text-center tracking-widest"
          >
          <p v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center font-medium">{{ errorMessage }}</p>
        </div>
        
        <button 
          @click="checkPassword" 
          class="w-full bg-[#A7B59D] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#A7B59D]/20 hover:brightness-95 transition-all"
        >
          Entrar no Painel
        </button>
        
        <router-link to="/" class="block text-center text-stone-400 hover:text-stone-600 text-sm mt-4 underline transition-colors">Voltar para o site</router-link>
      </div>
    </div>

    <div v-else class="space-y-12">
      
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative">
        <button @click="logout" class="absolute top-8 right-8 text-sm text-stone-400 hover:text-red-500 underline transition-colors">Sair / Trancar</button>
        
        <h2 class="text-3xl font-serif font-bold text-[#D7A49A] mb-6 pr-20">Cadastrar Presente</h2>
        
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
              <button @click="removeLinkField(index)" class="text-red-400 px-2 hover:text-red-600 font-bold">✕</button>
            </div>
            <button @click="addLinkField" class="text-[#A7B59D] font-bold text-sm">+ Adicionar loja</button>
          </div>

          <button @click="saveGift" class="w-full bg-[#A7B59D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#A7B59D]/20 hover:brightness-95 transition-all mt-6">
            Salvar Presente
          </button>
        </div>
      </div>

      <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <h2 class="text-2xl font-serif font-bold text-stone-800 mb-6">Presentes Atuais ({{ gifts.length }})</h2>
        
        <div v-if="gifts.length === 0" class="text-stone-400 text-center py-6">
          Nenhum presente cadastrado ainda.
        </div>

        <div v-else class="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-2">
          <div v-for="gift in gifts" :key="gift.id" class="py-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img :src="gift.image" :alt="gift.name" class="w-12 h-12 rounded-lg object-cover bg-stone-100 shadow-sm" />
              <div>
                <h4 class="font-bold text-stone-800 line-clamp-1">{{ gift.name }}</h4>
                <p class="text-sm text-stone-500">{{ gift.price }} <span v-if="gift.reserved" class="text-amber-600 font-medium ml-2">(Reservado)</span></p>
              </div>
            </div>
            <button @click="deleteGift(gift.id, gift.name)" class="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors">Remover</button>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>