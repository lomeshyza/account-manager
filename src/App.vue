<template>
  <div>
    <AccountsList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AccountsList from './components/AccountsList.vue'

export default defineComponent({
  components: { AccountsList }
})
</script>

<style>
body{font-family:Inter,Arial,sans-serif;background:#fafafa;margin:0}
</style>
