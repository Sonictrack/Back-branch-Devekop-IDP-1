<template>
 <div class="mt-3"> 
    <div>
      <b-alert show variant="secondary">
        <h4 >Recherche de documents</h4>
        <p>Vous pouvez ici rechercher des documents comme une pièce d'identité, un passeport ou un permis de conduire.</p>
      </b-alert>
    </div>
    <hr />
    <b-tabs active-nav-item-class="font-weight-bold text-uppercase text-dark">
      <b-tab title="Carte d'identité" active>
        <RechercheID type="id" imageSource="/id-card.jpg" placeholder="880692310285" :length="12" />
      </b-tab>
      <b-tab title="Passeport">
        <RechercheID
          type="passport"
          imageSource="/passport.png"
          placeholder="59RF05400"
          :length="9"
        />
      </b-tab>
      <b-tab title="Permis">
        <RechercheID
          type="driving-licence"
          imageSource="/driving-licence-1.png"
          placeholder="750104100001"
          :length="12"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import RechercheID from "~/components/commons/search/RechercheID";

export default {
  name: "rechercher",
  components: { RechercheID },
  middleware: "authenticated"
};
</script>
