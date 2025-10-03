<template>
  <div class="container">
    <header class="header">
      <h1>Учетные записи</h1>
      <button class="btn add" @click="add">+ Добавить</button>
    </header>

    <div class="hint">Метка: необязательное поле. Вводите метки через знак `;`. Каждая метка — до 50 символов.</div>

    <div class="list">
      <AccountRow v-for="acc in accounts" :key="acc.id" :account="acc" />
      <div v-if="accounts.length===0" class="empty">Список пуст. Нажмите «+ Добавить».</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountRow from './AccountRow.vue'
import { useAccountsStore } from '../stores/accounts'
import { v4 as uuidv4 } from 'uuid'

export default defineComponent({
  components: { AccountRow },
  setup() {
    const store = useAccountsStore()

    function add() {
      const id = uuidv4()
      store.add({ id, labels: [], type: 'LDAP', login: '', password: null })
    }

    return { accounts: store.accounts, add }
  }
})
</script>

<style scoped>
.container{max-width:900px;margin:20px auto;padding:12px}
.header{display:flex;justify-content:space-between;align-items:center}
.btn.add{background:#1976d2;color:#fff;border:none;padding:8px 12px;border-radius:6px}
.hint{margin:8px 0;color:#555}
.list{display:flex;flex-direction:column;gap:8px}
.empty{padding:12px;color:#777}
</style>

<!-- AccountsList component -->
