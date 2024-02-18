<template>
  <!-- Main frame -->
  <div class="masthead">
    <!-- First background -->
    <div class="first category">
      <div class="row align-items-center justify-content-center text-center">

        <header class="col-lg-10 align-self-end">
          <h1 class="title  text-uppercase text-white font-weight-bold">
            ID Protect
          </h1>
          <hr class="divider my-4">
        </header>

        <main class="col-lg-8 align-self-baseline">
          <p class="subtitle text-white-75 mb-5">
            Maîtriser son identité à l'ère du numérique
          </p>
          <NuxtLink v-if="!isLoggedIn"  class="register-btn btn btn-xl js-scroll-trigger" to="particulier/authentification">
            Devenir membre
          </NuxtLink>
          <div v-else class="register-btn btn btn-xl js-scroll-trigger">
            Vous êtes déjà membre
          </div>
        </main>
      </div>
    </div>

    <div class="category aside light">
      <img src="/illustration_1.png">
      <div class="description">
        <h2>La protection de l’identité, notre priorité</h2>
        <p>Nous souhaitons permettre à chaque citoyen de prendre
           contrôle sur son identité afin qu’elle ne soit, en aucun
           cas, utilisée par un faussaire.</p>
        <p>Ainsi, nous avons créé un outil de gestion des données
           personnelles pour recenser les documents d’identité perdus
           ou volés afin qu’ils soient écartés par nos partenaires.</p>
      </div>
    </div>

    <div class="category aside dark">
      <div class="register-box">
        <NuxtLink class="register-dialog" to="/particulier/authentification">
          <img class="icone" src="/icon-shield.svg" alt="shield icon">
          <span class="register-title">Sécuriser un document</span>
        </NuxtLink>
        <div class="register-text">
          <div> pour prévenir les tentatives d'usurpation en ligne</div>
          <a> en savoir plus </a>
        </div>
      </div>
      <div class="description">
        <h2>Perte de carte d’identité, vol de passeport ?</h2>
        <p>Un document d’identité perdu ou volé peut être utilisé à
           tout moment par un faussaire, même s’il est déclaré à la
           police.</p>
        <p>L’initiative ID PROTECT, c’est permettre aux services numérisés
           (banques, assurances, retailers) de détecter les
           tentatives de fraude utilisant ces documents.</p>
      </div>
    </div>

    <div class="category aside light">
      <img src="/illustration_2.jpg">
      <div class="description">
        <h2>Banques, assurances, commerçants</h2>
        <p>Au coeur de la digitalisation de vos services, vous cherchez
           à nouer une relation de confiance avec vos clients.</p>
        <p>ID Protect vous permet prévenir une entrée en relation
           numérique avec un faussaire.<br>
           Nous sommes la première base de donnée vous offrant la
           possibilité de vérifier si un document a été déclaré perdu
           ou volé.</p>
      </div>
    </div>


    <div class="category aside dark">
      <div class="register-box">
        <NuxtLink class="register-dialog" to="/partenaire/authentification">
          <img class="icone" src="/icon-handshake.svg" alt="handshake icon">
          <span class="register-title">Devenir partenaire</span>
        </NuxtLink>
        <div class="register-text">
          <div> pour prévenir les tentatives d'usurpation en ligne</div>
          <a> en savoir plus </a>
        </div>
      </div>
      <div class="description">
        <h2>Responsabilisez votre entreprise pour la
            protection de l’identité de vos clients</h2>
        <p>Devenez partenaire pour pouvoir vérifier instantanément
           si un document qui vous est présenté a été déclaré volé
           ou perdu. Ainsi, vous éviterez les frais engendrés par un
           contrat conclu avec un faussaire.</p>
      </div>
    </div>

    <cookie-law theme="dark-lime">
      <div slot-scope="props">
        <p>
          Nous utilisons les cookies afin de fournir les services et fonctionnalités proposés sur notre site et afin d’améliorer l’expérience de nos utilisateurs. Les cookies sont des données qui sont téléchargés ou stockés sur votre ordinateur ou sur tout autre appareil.
        </p>
        <p>
          En cliquant sur ”J’accepte”, vous acceptez l’utilisation des cookies. Vous pourrez toujours les désactiver ultérieurement. Si vous supprimez ou désactivez nos cookies, vous pourriez rencontrer des interruptions ou des problèmes d’accès au site.
        </p>
        <b-button pill variant="success" @click="props.accept"><span>J'accèpte</span></b-button>
        <b-button pill variant="danger" @click="props.close"><span>Je refuse</span></b-button>
      </div>
    
    </cookie-law>
  </div>
</template>

<script>
  import mixinUser from "~/mixins/mixinUser";
  import CookieLaw from 'vue-cookie-law'
  export default {
    components: {CookieLaw},
    name: 'Accueil',
    layout: 'home',
    mixins: [mixinUser],
  }
</script>

<style scoped lang="scss">
  * {
    font-family: $body-font-family;
  }

  h1, h2, h3, h4, h5, h6, .title, .title-font {
    font-family: $headings-font-family;
  }

  @include media-breakpoint-up(lg) {
    p {
      font-size: 1.15rem;
    }
    h1 {
      font-size: 3rem;
    }
  }

  @include media-breakpoint-up(xl) {
    h1 {
      font-size: 3.5rem;
    }
  }

  .masthead {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .icone {
    width: 50px;
    height: 50px;
    filter: invert(30%) sepia(96%) saturate(463%) hue-rotate(175deg) brightness(92%) contrast(98%);
    margin: auto 0;
  }


  .category {
    width: 100%;
    max-width: 100%;

    &.first {
      background: url('/background.png');
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: scroll;
      background-size: cover;
      height: 80%;

      & > * {
        height: 100%;
        margin: auto 0;
      }

      .subtitle {
        font-weight: lighter;
        font-size: 25px;
        color: $white;
      }

      .title {
        font-family: "Raleway", sans-serif;
        font-size: 2.25rem;
        width: max-content;
        margin: auto;
        padding-bottom: 15px;
        border-bottom: 1px solid white;
      }

      .register-btn {
        background-color: white;
        color: $main-font-color;
        font-weight: bold;
      }
    }
  }

  .light {
    background: $white;
    color: $main-font-color;
  }

  .dark {
    background: $main-font-color;
    color: $white;
  }

  .aside {
    height: max-content;
    padding: 15px 15% 15px 10%;

    justify-content: space-around;

    display: flex;
    flex-flow: column-reverse nowrap;

    h2 {
      text-align: left;
      font-size: 28px;
      margin-bottom: 1em;
    }

    p {
      font-size: 21px;
    }

    .description {
      width: 100%;
      margin: 15px auto;
    }

    & > *:first-child {
      width: 350px;
      max-width: 80%;
      height: auto;
      max-height: 350px;
      margin: 0 auto;
    }

    @include media-breakpoint-up(lg) {
      flex-flow: row nowrap;

      .description {
        width: 50%;
        margin: 45px auto;
      }

      & > *:first-child {
        margin: 0;
      }
    }
  }

  .register-box {
    align-self: center;
  }

  .register-text {
    text-align: center;
    width: 80%;
    margin: auto;

    font-style: italic;
    font-weight: bold;

    & * {
      margin: 0 auto;
      width: 100%;
      @include media-breakpoint-up(lg) {
        width: 75%;
      }
    }

    & a {
      text-decoration: underline !important;
      padding-top: 20px;
      display: block;
    }
  }

  .register-dialog {
    background: white;
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 15px;
    justify-content: space-evenly;
    padding: 5px;
    border-radius: 30px;

    &:hover {
      text-decoration-color: $main-font-color;
    }

    & *:hover {
      color: $main-font-color;
    }
  }

  .register-title {
    color: #265EA8;
    font-size: 1.4em;
    font-weight: bold;
    align-self: center;
  }
</style>
