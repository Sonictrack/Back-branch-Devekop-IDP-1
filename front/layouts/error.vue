<template>
  <div class="container py-32" dark>
    <div class="bg-red rounded-lg py-8 py-lg-16 px-4 text-center">
      <div class="text-white">
        <h1 class="text-32 font-weight-bold">
          404
        </h1>
        <p class="mx-auto mb-4" style="max-width: 500px;">
          La page que vous demandez n'existe pas.
        </p>
      </div>
      <CommonsButton
        :content="{ title: 'Retour à l\'accueil', textColor: 'text-red', path: '/' }"
      />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
