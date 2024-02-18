<template>
  <div class="mt-3"> 
      <b-alert show variant="secondary">
        <h4 >Gestion de mes documents perdus ou volés</h4>
        <p>
          Vous pouvez ici effectuer vos demandes de pertes de documents perdus ou volés en attachant à votre 
          demande les pièces demandées comme la copie du document et le proces verbal.
        </p>
      </b-alert>
    <hr/>
  <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
    <b-tab title="Carte d'identité" active>
      <DeclarationPerte
        type="id"
        name="carte d'identité"
        imageSource="/id-card.jpg"
        placeholder="880692310285"
        :length=12
      />
    </b-tab>
    <b-tab title="Passeport">
      <DeclarationPerte
        type="passport"
        name="passeport"
        imageSource="/passport.png"
        placeholder="59RF05400"
        :length=9
      />
    </b-tab>
    <b-tab title="Permis">
      <DeclarationPerte
        type="driving-licence"
        name="permis de conduire"
        imageSource="/driving-licence-1.png"
        placeholder="750104100001"
        :length=12
      />
    </b-tab>
  </b-tabs>
</div>
</template>

<script>
  import Vue from 'vue'
  import DeclarationPerte from '~/components/member/DeclarationPerte'
 
  const DeclarerPertePage = Vue.extend({
    name: 'declarer_perte',
    middleware: 'authenticated',
    components: { DeclarationPerte},
    mounted() {
      this.checkUser().then((result) => {
        if(!result)
          this.logout()
      })
    },
  })

  export default DeclarerPertePage
</script>
