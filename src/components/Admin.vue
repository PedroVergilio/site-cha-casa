<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'

// === LÓGICA DE LOGIN ===
const isAuthenticated = ref(false)
const passwordInput = ref('')
const errorMessage = ref('')

const checkPassword = () => {
  if (passwordInput.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    isAuthenticated.value = true
  } else {
    errorMessage.value = 'Senha incorreta! Xô, penetra! 🛑'
    passwordInput.value = ''
  }
}

const logout = () => {
  isAuthenticated.value = false
  passwordInput.value = ''
}

// === LÓGICA DO BANCO DE DADOS ===
const name = ref('')
const price = ref('')
const image = ref('')
const links = ref([{ store: '', url: '' }])
const gifts = ref([])
const giftsCollection = collection(db, 'gifts')

// Variáveis para controlar a edição
const isEditing = ref(false)
const editingId = ref(null)

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

// Função que puxa os dados para o formulário
const editGift = (gift) => {
  name.value = gift.name
  price.value = gift.price
  image.value = gift.image
  
  // Copia os links de forma segura para não bugar a tela
  if (gift.links && gift.links.length > 0) {
    links.value = JSON.parse(JSON.stringify(gift.links))
  } else {
    links.value = [{ store: '', url: '' }]
  }

  isEditing.value = true
  editingId.value = gift.id

  // Rola a tela suavemente para o formulário lá no topo
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Cancela a edição e limpa o formulário
const cancelEdit = () => {
  name.value = ''
  price.value = ''
  image.value = ''
  links.value = [{ store: '', url: '' }]
  isEditing.value = false
  editingId.value = null
}

const saveGift = async () => {
  if (!name.value || !price.value) return alert("Preencha ao menos nome e preço!")
  
  try {
    const giftData = {
      name: name.value,
      price: price.value,
      image: image.value || 'https://images.unsplash.com/photo-1556911220-e150213ff7ad?q=80&w=800',
      links: links.value.filter(l => l.store && l.url)
    }

    if (isEditing.value) {
      // ATUALIZA O EXISTENTE
      await updateDoc(doc(db, 'gifts', editingId.value), giftData)
      alert("Presente atualizado com sucesso!")
    } else {
      // CRIA UM NOVO
      giftData.reserved = false // Apenas na criação define como não reservado
      await addDoc(giftsCollection, giftData)
      alert("Presente cadastrado com sucesso!")
    }
    
    // Limpa o formulário no final
    cancelEdit()
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

const unreserveGift = async (id, giftName) => {
  const confirmacao = confirm(`Deseja liberar o presente "${giftName}" para ser comprado novamente?`)
  if (!confirmacao) return
  
  try {
    await updateDoc(doc(db, 'gifts', id), { reserved: false })
    alert("Presente liberado com sucesso!")
  } catch (e) {
    alert("Erro ao liberar: " + e.message)
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
      
      <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative transition-all" :class="{'ring-2 ring-[#A7B59D] bg-[#A7B59D]/5': isEditing}">
        <button @click="logout" class="absolute top-8 right-8 text-sm text-stone-400 hover:text-red-500 underline transition-colors">Sair / Trancar</button>
        
        <h2 class="text-3xl font-serif font-bold text-[#D7A49A] mb-6 pr-20">
          {{ isEditing ? 'Editar Presente' : 'Cadastrar Presente' }}
        </h2>
        
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
            
            <div v-if="image" class="mt-2 w-24 h-24 border border-stone-200 rounded-lg overflow-hidden bg-white p-1">
              <img :src="image" class="w-full h-full object-contain" />
            </div>
          </div>

          <div class="pt-4 border-t border-stone-100">
            <h3 class="font-bold text-stone-800 mb-3">Links das Lojas</h3>
            <div v-for="(link, index) in links" :key="index" class="flex gap-2 mb-2">
              <input v-model="link.store" placeholder="Loja (ex: Amazon)" class="flex-1 p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D]">
              <input v-model="link.url" placeholder="Link (http://...)" class="flex-[2] p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#A7B59D]">
              <button @click="removeLinkField(index)" class="text-red-400 px-2 hover:text-red-600 font-bold">✕</button>
            </div>
            <button @click="addLinkField" class="text-[#A7B59D] font-bold text-sm">+ Adicionar loja</button>
          </div>

          <div class="flex gap-4 mt-6">
            <button 
              v-if="isEditing" 
              @click="cancelEdit" 
              class="flex-1 bg-stone-100 text-stone-600 font-bold py-4 rounded-2xl hover:bg-stone-200 transition-all"
            >
              Cancelar
            </button>
            
            <button 
              @click="saveGift" 
              class="flex-[2] bg-[#A7B59D] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#A7B59D]/20 hover:brightness-95 transition-all"
            >
              {{ isEditing ? 'Atualizar Presente' : 'Salvar Presente' }}
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
        <h2 class="text-2xl font-serif font-bold text-stone-800 mb-6">Presentes Atuais ({{ gifts.length }})</h2>
        
        <div v-if="gifts.length === 0" class="text-stone-400 text-center py-6">
          Nenhum presente cadastrado ainda.
        </div>

        <div v-else class="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-2">
          <div v-for="gift in gifts" :key="gift.id" class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            
            <div class="flex items-center gap-4 flex-1">
              <img :src="gift.image" :alt="gift.name" class="w-14 h-14 rounded-lg object-contain bg-white border border-stone-100 p-1" />
              <div>
                <h4 class="font-bold text-stone-800">{{ gift.name }}</h4>
                <p class="text-sm text-stone-500">{{ gift.price }} 
                  <span v-if="gift.reserved" class="text-amber-600 font-medium ml-2">(Reservado 🔒)
                    <button @click="unreserveGift(gift.id, gift.name)" class="text-blue-500 hover:text-blue-700 underline text-xs ml-2 transition-colors">Desfazer reserva</button>
                </span>
                </p>
              </div>
            </div>
            
            <div class="flex gap-2 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
              <button 
                @click="editGift(gift)" 
                class="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                Editar
              </button>
              
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

    </div>

  </div>
</template>