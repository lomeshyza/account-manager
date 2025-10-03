<template>
  <div class="account-row">
    <input
      class="input label"
      :class="{'invalid': errors.labels}"
      v-model="local.labelsRaw"
      placeholder="Метка (через ;)"
      @blur="onLabelsBlur"
      maxlength="200"
    />

    <select v-model="local.type" @change="onTypeChange">
      <option value="LDAP">LDAP</option>
      <option value="Local">Локальная</option>
    </select>

    <input
      class="input login"
      v-model="local.login"
      placeholder="Логин"
      @blur="onLoginBlur"
      maxlength="100"
    />

    <input
      v-if="local.type === 'Local'"
      class="input password"
      v-model="local.password"
      type="password"
      placeholder="Пароль"
      @blur="onPasswordBlur"
      maxlength="100"
    />

    <button class="btn delete" @click="remove">Удалить</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import type { Account } from '../types'
import { useAccountsStore } from '../stores/accounts'

export default defineComponent({
  name: 'AccountRow',
  props: {
    account: { type: Object as () => Account, required: true }
  },
  setup(props) {
    const store = useAccountsStore()
    // local copy for immediate editing
    const local = reactive({
      id: props.account.id,
      labelsRaw: props.account.labels.map((l: any) => l.text).join(';'),
      type: props.account.type,
      login: props.account.login,
      password: props.account.password ?? ''
    } as any)

    const errors = reactive({ labels: false, login: false, password: false })

    function parseLabels(raw: string) {
      return raw.split(';').map(s => s.trim()).filter(Boolean).map((t: string) => ({ text: t }))
    }

    function validateAndSave(field?: string) {
      // validate based on current local state
      let ok = true
      // login required
      if (!local.login || local.login.trim().length === 0 || local.login.length > 100) {
        errors.login = true; ok = false
      } else errors.login = false

      // password required for Local type
      if (local.type === 'Local') {
        if (!local.password || local.password.length === 0 || local.password.length > 100) {
          errors.password = true; ok = false
        } else errors.password = false
      } else {
        // LDAP: password becomes null
        errors.password = false
      }

      // labels: optional, but each label length must be <=50
      const labelsArr = parseLabels(local.labelsRaw)
      if (labelsArr.some((l: any) => l.text.length > 50)) {
        errors.labels = true; ok = false
      } else errors.labels = false

      if (ok) {
        const toSave: Partial<Account> = {
          labels: labelsArr,
          type: local.type,
          login: local.login,
          password: local.type === 'Local' ? local.password : null
        }
        store.update(local.id, toSave)
      }

      return ok
    }

    function onLabelsBlur() { validateAndSave('labels') }
    function onLoginBlur() { validateAndSave('login') }
    function onPasswordBlur() { validateAndSave('password') }

    function onTypeChange() {
      // when switching to LDAP clear password locally and save
      if (local.type === 'LDAP') {
        local.password = ''
      }
      validateAndSave('type')
    }

    function remove() {
      store.remove(local.id)
    }

    // expose for template
    return { local, errors, onLabelsBlur, onLoginBlur, onPasswordBlur, onTypeChange, remove }
  }
})
</script>

<style scoped>
.account-row{
  display:flex;
  gap:8px;
  align-items:center;
  padding:8px;
  border:1px solid #ddd;
  border-radius:6px;
}
.input{padding:6px 8px;border:1px solid #ccc;border-radius:4px}
.input.invalid{border-color:#e53935}
.delete{background:#ef5350;color:white;border:none;padding:6px 8px;border-radius:4px}
</style>
