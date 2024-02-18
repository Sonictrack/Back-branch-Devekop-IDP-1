<style>
.main {
  /* border: 2px solid red; */
  height: 69.7vh;
  display: flex;
  flex-direction: column;
  gap: 1%;
  align-items: center;
  justify-content: space-around;
}
.myBtn {
  display: flex;
  flex-direction: column;
}
.text-container {
  height: 30%;
  width: 90%;
  margin-left: 10%;
  margin-top: 20px;
  /* border: 2px solid blue; */
}

.filtreContainer {
  height: 60%;
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  /* border: 2px solid blue; */
}

.filtre {
  height: 100%;
  width: 30%;
  border: 2px solid #3963ab;
  border-radius: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5%;
  font-weight: bold;
}

.filtre img {
  width: 100px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.titleH2 {
  font-size: 1rem;
  font-weight: 500;
}

.titleH3 {
  font-size: 1rem;
  font-weight: 500;
}

@media screen and (max-width: 997px) {
  .filtreContainer {
    text-align: center;
  }
}

@media screen and (max-width: 570px) {
  .text-container {
    width: 80%;
    margin: 10px;
  }

  .filtreContainer {
    margin: 10px;
    text-align: center;
    flex-wrap: nowrap;
    gap: 2%;
  }

  .filtre {
    gap: 2%;
    width: 40%;
  }
}

@media screen and (max-width: 420px) {
  .main {
    height: 200vh;
    justify-content: flex-start;
    text-align: center;
    margin: 5px;
  }

  .text-container {
    width: 80%;
    height: 14%;
  }

  .filtreContainer {
    height: 40%;
    width: 60%;

    flex-wrap: wrap;
    gap: 5%;
    margin: 10px;
  }

  .filtre {
    gap: 12%;
    width: 100%;
    height: 60%;
  }
}

@media screen and (max-width: 338px) {
  .main {
    height: 200vh;
    justify-content: flex-start;
    text-align: center;
    margin: 5px;
  }

  .text-container {
    width: 80%;
    height: 21%;
  }

  .filtreContainer {
    height: 40%;
    width: 90%;

    flex-wrap: wrap;
    gap: 5%;
    margin: 10px;
  }

  .filtre {
    gap: 12%;
    width: 100%;
    height: 60%;
  }
}
</style>
<template>
  <div class="main">
    <section class="text-container">
      <!-- <article> -->
      <!-- <h1 class="title">TÉLÉCHARGEZ VOS FILTRES DE PROTECTION DOCUMENTAIRE</h1> -->
      <!-- <h2 class="titleH2">VOICI VOS FILTRES DE PROTECTION DOCUMENTAIRE ID PROTECT !</h2> -->
      <!-- </article> -->
      <article>
        <h1 class="title bold">
          La protection de vos documents est primordiale !
        </h1>
        <span>
          Déposez le filtre de protection documentaire ID Protect sur vos
          documents avant de les envoyer à un tiers.
        </span>
      </article>
      <p>Si tu ne sais pas comment l'appliquer sur tes documents, notre fondateur a fait un Tuto &#x1F609;</p>
      <span>
        <button>
           <span>Cliques </span>
          <a
            href="https://www.youtube.com/watch?v=1Eu2Ki3-iWg&ab_channel=IDprotect" target="_blank"
            ><strong>ici</strong></a
          > <span> pour voir la vidéo.</span>
        </button>
      </span>
    </section>

    <section class="filtreContainer">
      <article class="filtre">
        <h3 class="titleH3">Filtre protecteur document protégé</h3>
        <button class="myBtn">
          <img
            :src="require('@/assets/images/filtre_protection_documentaire_360.png')"
            alt="badge"
          />
          <a
            :href="require('@/assets/images/filtre_protection_documentaire_360.png')"
            download="badgeBlue.png"
            >Télécharger</a
          >
        </button>
      </article>
      <article class="filtre">
        <h3 class="titleH3">Filtre protecteur document protégé</h3>
        <button class="myBtn">
          <img
            :src="require('@/assets/images/id_protect_filtre_orange__1__360.png')"
            alt="badge"
          />
          <a
            :href="require('@/assets/images/id_protect_filtre_orange__1__360.png')"
            download="badgeGreen.png"
            >Télécharger</a
          >
        </button>
      </article>
      <article class="filtre">
        <h3 class="titleH3">Filtre protecteur document protégé</h3>
        <button class="myBtn">
          <img :src="require('@/assets/images/filtre_location_immobili__re__1__720.png')" alt="badge" />
          <a
            :href="require('@/assets/images/filtre_location_immobili__re__1__720.png')"
            download="badge.png"
            >Télécharger</a
          >
        </button>
      </article>
      <Video />
    </section>
  </div>
</template>
<script>



export default {

  middleware: "auth"
}
</script>
