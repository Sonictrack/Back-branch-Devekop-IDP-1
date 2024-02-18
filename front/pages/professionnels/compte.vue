<template>
  <div class="Compte py-16 py-lg-16">
    <AccountEdit />
  </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
