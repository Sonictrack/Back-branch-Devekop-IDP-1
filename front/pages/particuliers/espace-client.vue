<style scoped>
.h1Title {
  /* margin-right: 70vw; */
  padding-top: 20px;
  padding-bottom: 20px;
  margin: 0;
  width: 30rem;
}

.mainFlex {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  /* border: 3px solid red; */
}

.mainContainer {
  /* border: 3px solid green; */
  height: 90%;
  width: 98%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2%;
  padding-bottom: 10px;
}

.handleRouterLink {
  width: 20vw;
  height: 42px;
  border-radius: 2%;
  color: white;
  background: #3963ab;
}

.aside {
  border: 1px solid #a7b6bc;
  border-radius: 3%;
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.aside nav {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.aside a {
  width: 100%;
  height: 100%;
  border-bottom: 0.2px solid #a7b6bc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
nav {
  width: 100%;
  height: 100%;
}

.cardContainer {
  /* border: 2px solid blue; */
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2%;
}

.card {
  border: 1px solid #a7b6bc;
  border-radius: 3%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  gap: 5%;
}

.card img {
  width: 60px;
  height: 50px;
}

/* @media screen and (max-width: 1100px ) {

} */
@media screen and (min-width: 993px ) {
  .mainFlex {
    /* border: 5px solid red; */
  }
  .h1Title {
  /* margin-right: 70vw; */
  padding-top: 55px;
  padding-bottom: 20px;
  margin: 0;
  width: 95vw;
}
  .aside {
    width: 35%;
    height: 100%;
  }
  nav {
    height: 100%;
    width: 80%;
  }

}
@media screen and (min-width: 769px) and (max-width: 992px)  {
  .mainFlex {
    height: 83vh;
    /* background: yellow; */
  }
  .h1Title {
  /* margin-right: 70vw; */
  padding-top: 55px;
  padding-bottom: 20px;
  margin: 0;
  width: 95vw;
}
  .mainContainer {


  }
  .cardContainer{


  }
  .aside {
    width: 37%;
    height: 100%;
  }
  nav {
    height: 100%;
    width: 80%;
  }
  nav a {
    font-size: 0.81rem;
  }

}
@media screen and (min-width: 451px) and (max-width: 768px) {  .h1Title {

    width: 18rem;
  }
  .mainFlex {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 260vh;
    /* background: red; */

  }
  .mainContainer {
    width: 100%;
    height: 235vh;
    display: flex;
    flex-direction: column;
  }
  .cardContainer{
    height: 190vh;
    width: 95%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: 5%;
  }
  .aside {
    width: 95%;
    height: 100%;
  }
  nav {
    height: 100%;
    width: 100%;
  }
  .card {

    height: 100vw;
  }
  .card button{
    width: 75vw;
  }

}
@media screen and (min-width: 0px) and (max-width: 450px){
  .h1Title {

    width: 18rem;
  }
  .mainFlex {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 240vh;
    /* background: green; */

  }
  .mainContainer {
    width: 100%;
    height: 215vh;
    display: flex;
    flex-direction: column;
  }
  .cardContainer{
    height: 190vh;
    width: 95%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: 5%;
  }
  .aside {
    width: 95%;
    height: 100%;
  }
  nav {
    height: 100%;
    width: 100%;
  }
  .card {

    height: 100vw;
  }
  .card button{
    width: 75vw;
  }

}
@media screen and (min-width: 332px) and (max-width: 450px){
  .h1Title {

    width: 18rem;
  }
  .mainFlex {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 265vh;
    /* background: blue; */

  }
  .mainContainer {
    width: 100%;
    height: 240vh;
    display: flex;
    flex-direction: column;
  }
  .cardContainer{
    height: 190vh;
    width: 95%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: 5%;
  }
  .aside {
    width: 95%;
    height: 100%;
  }
  nav {
    height: 100%;
    width: 100%;
  }
  .card {

    height: 100vw;
  }
  .card button{
    width: 75vw;
  }

}

</style>

<template>
  <main class="mainFlex">
    <h1 class="h1Title" v-if="getCurrentUser">
      {{ $t("account.header.title", { name: getCurrentUser.firstname }) }}
    </h1>
    <div class="mainContainer">
      <aside class="aside">
        <nav>
          <router-link to="/particuliers/mes-documents"
            >MES DOCUMENTS</router-link
          >
          <router-link to="/particuliers/mes-credits"
            >MES CRÉDITS DE VÉRIFICATION</router-link
          >
          <router-link to="/particuliers/filtre"
            >TÉLÉCHARGER MON FILTRE</router-link
          >
          <!-- <a
            href="https://idprotect.fr/protection-documentaire-2/"
            target="_blank"
            ></a -->
          <!-- > -->
          <a href="https://idprotect.fr/community-blog/" target="_blank"
            >BLOG COMMUNITY</a
          >
          <router-link to="/particuliers/historique"
            >MES NOTIFICATIONS</router-link
          >
          <!-- <router-link to="/particuliers/3D-secure"
            >RÉALISER MON 3D Secure</router-link
          > -->
          <!-- <router-link to="/particuliers/mes-analyses"
            >MES VÉRIFICATION DOCUMENTS</router-link
          >
          <router-link to="/particuliers/nos-videos"
            >NOS VIDÉOS : Témoignages</router-link
          > -->
        </nav>
      </aside>
      <section class="cardContainer">
        <article class="card">
          <img
            src="@/assets/images/IDTracker.svg"
            alt="Your SVG"
            width="40px"
            height="40px"
            class="m-2"
          />

          <h5 class="card-title">ID TRACKER</h5>
          <p class="card-text">Je souhaite suivre mon document d'identité</p>
          <!-- <v-btn
            color="primary"
            dark
            fab
            large
            @click="goToPage('/particuliers/suivre-document')"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn> -->
          <!-- <router-link
              id="add_demand"
              to="/particuliers/suivre-document"
              class="btn btn-pink handleRouterLink" >
              Activer le suivi
            </router-link> -->
          <button
            class="handleRouterLink"
            @click="goToPage('/particuliers/suivre-document')"
          >
            Activer le suivi
          </button>
        </article>
        <article class="card">
          <img src="@/assets/images/Vérification.jpg" alt="Your SVG" />
          <h5>VERIFICATION</h5>
          <p>Je souhaite vérifier un document d'identité</p>
          <!-- <v-btn
            color="primary"
            dark
            fab
            large
            @click="goToPage('/particuliers/controler-document')"
          >
        </v-btn> -->
          <!-- <router-link
              id="add_demand"
              to="/particuliers/acheter-credits"
              class="btn btn-pink handleRouterLink" >
              Verifier
            </router-link> -->
          <button
            class="handleRouterLink"
            @click="goToPage('/particuliers/controler-document')"
          >
            Vérifier
          </button>
        </article>
        <article class="card card3">
          <img src="@/assets/images/Pertedocument.svg" alt="Your SVG" />
          <h5>PERTE</h5>
          <p>Je souhaite déclarer la perte/vol d'un document</p>
          <!-- <v-btn
            color="primary"
            dark
            fab
            large
            @click="goToPage('/particuliers/perte-ou-vol')"
          >
            <v-icon>mdi-shield-check</v-icon>
          </v-btn> -->
          <!-- <router-link
              id="add_demand"
              to="/particuliers/perte-ou-vol"
              class="btn btn-pink handleRouterLink" >
              Déclaration
            </router-link> -->
          <button
            class="handleRouterLink"
            @click="goToPage('/particuliers/perte-ou-vol')"
          >
            Déclaration
          </button>
        </article>
      </section>
    </div>
  </main>
</template>

<script>
import UserMixin from "../../mixins/UserMixin";


export default {
  middleware: 'auth',
  mixins: [UserMixin],
  methods: {
    goToPage(url) {
      // rediriger l'utilisateur vers la page correspondante
      this.$router.push(url);
    },
  },
};
</script>
