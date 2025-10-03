import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Account } from '../types'

const STORAGE_KEY = 'accounts_v1'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>(load())

  function load(): Account[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Account[]
    } catch (e) {
      console.error('Failed to load accounts', e)
      return []
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
  }

  function add(account: Account) {
    accounts.value.push(account)
    persist()
  }

  function update(id: string, patch: Partial<Account>) {
    const idx = accounts.value.findIndex(a => a.id === id)
    if (idx === -1) return
    accounts.value[idx] = { ...accounts.value[idx], ...patch }
    persist()
  }

  function remove(id: string) {
    accounts.value = accounts.value.filter(a => a.id !== id)
    persist()
  }

  return { accounts, add, update, remove }
})

// store implementation added
