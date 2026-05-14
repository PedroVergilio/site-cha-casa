<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore'

const name = ref('')
const price = ref('')
const image = ref('')
const links = ref([{ store: '', url: '' }]) // Começa com um campo de link

const addLinkField = () => {
  links.value.push({ store: '', url: '' })
}

const removeLinkField = (index) => {
  links.value.splice(index, 1)
}

const saveGift = async () => {
  if (!name.value || !price.value) return alert("Preencha ao menos nome e preço!")
  
  try {
    await addDoc(collection(db, 'gifts'), {
      name: name.value,
      price: price.value,
      image: image.value || 'https://images.unsplash.com/photo-1556911220-e150213ff7ad?q=80&w=800',
      links: links.value.filter(l => l.store && l.url), // Limpa links vazios
      reserved: false
    })
    alert("Presente cadastrado com sucesso!")
    // Limpar formulário
    name.value = ''; price.value = ''; image.value = ''; links.value = [{ store: '', url: '' }]
  } catch (e) {
    alert("Erro ao salvar: " + e.message)
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
    <h2 class="text-3xl font-serif font-bold text-stone-800 mb-6">Cadastrar Novo Presente</h2>
    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-stone-700 mb-1">Nome do Item</label>
        <input v-model="name" type="text" placeholder="Ex: Batedeira Planetária" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#689550]">
      </div>

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-1">Preço Sugerido (Texto)</label>
        <input v-model="price" type="text" placeholder="Ex: R$ 350,00" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#689550]">
      </div>

      <div>
        <label class="block text-sm font-medium text-stone-700 mb-1">URL da Imagem</label>
        <input v-model="image" type="text" placeholder="Link da foto do produto" class="w-full p-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-[#689550]">
      </div>

      <div class="pt-4 border-t border-stone-100">
        <h3 class="font-bold text-stone-800 mb-3">Links das Lojas</h3>
        <div v-for="(link, index) in links" :key="index" class="flex gap-2 mb-2">
          <input v-model="link.store" placeholder="Loja (ex: Amazon)" class="flex-1 p-3 rounded-xl border border-stone-200 outline-none">
          <input v-model="link.url" placeholder="Link (http://...)" class="flex-[2] p-3 rounded-xl border border-stone-200 outline-none">
          <button @click="removeLinkField(index)" class="text-red-400 px-2">✕</button>
        </div>
        <button @click="addLinkField" class="text-[#689550] font-bold text-sm">+ Adicionar outra loja</button>
      </div>

      <button @click="saveGift" class="w-full bg-[#689550] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#689550]/20 hover:brightness-95 transition-all mt-6">
        Salvar Presente na Lista
      </button>
      
      <router-link to="/" class="block text-center text-stone-400 text-sm mt-4 underline">Voltar para a lista pública</router-link>
    </div>
  </div>
</template>