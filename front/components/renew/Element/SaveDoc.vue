<template>
  <div class="w-100">
    <header class="text-center text-primary p-2">
      <h2 class="text-32 font-weight-light">
        Souhaitez-vous enregistrer votre ancien document sur ID <span class="text-uppercase"> Protect</span> ?
      </h2>
      <p class="font-weight-bold">
        ID <span class="text-uppercase"> Protect</span> vous permet de prévenir une utilisation frauduleuse de votre document pour 9,99€
      </p>
    </header>
    <div class="d-flex flex-column flex-md-row w-100 align-items-center justify-content-center">
      <CommonsButton :content="{ title: 'Oui, protéger mon document', bgColor: 'white', textColor: 'text-primary'}" class="mr-2 my-2" @click.native="sendForm(true)" />
      <CommonsButton :content="{ title: 'Non, peut-être plus tard', bgColor: 'white', textColor: 'text-primary'}" class="mr-2 my-2" @click.native="sendForm(false)" />
    </div>
    <div class="section row d-flex align-items-center text-left-lg py-16" :style="{'background-image': 'url(' + require('@/assets/images/bgs/cam.jpg') + ')'}">
      <div class="col-md-3 d-flex align-items-center justify-content-center text-center">
        <img src="@/assets/images/logos/logo-orange.png" alt="ID PROTECT" width="200px">
      </div>
      <div class="col-md-9 text-orange font-weight-light">
        <h4 class="mb-4">
          ID <span class="text-uppercase"> Protect</span> resence les numéros de documents inactifs ou expirés afin que ses partenaires (banques, assurances) détecte une tentative d’utilisation par un faussaire.
        </h4>
        <h5 class="mb-0">
          En cas de tentative d’usurpation de votre identité avec ke numéro de document enregistré, vous serez notifié sur votre plateforme ID <span class="text-uppercase"> Protect</span>.
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    sendForm (value) {
      this.$emit('success', {
        form: {
          lockDocument: value
        }
      })
    }
  }
}
</script>
