<template>
  <BaseNavigationBar
    :links="[
    {name: 'Partenaire', link: '/partenaire/authentification'},
    {name: 'Membre', link: '/particulier/authentification'},
    {name: 'Admin', link: '/admin/authentification'}
  ]"

    :transparent="transparent"
  />
</template>

<script>
  import BaseNavigationBar from '~/components/commons/navbar/BaseNavigationBar'

  export default {
    name: 'NotLoggedIn',
    components: { BaseNavigationBar },
    props: {
      transparent: { type: Boolean, required: false, default: false },
    }
  }
</script>
