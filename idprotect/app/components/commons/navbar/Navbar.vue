<template>
  <!-- For individuals -->
  <BaseNavigationBar
    v-if="isLoggedInAsIndividual"
    :links="[
      {name: 'Renouvellement', link: '/particulier/renouvellement', icon: 'file-earmark-plus', tooltip: 'Renouvellement'},
      {name: 'Déclarer une perte', link: '/particulier/declarer_perte', icon: 'exclamation-triangle', tooltip: 'Déclarer une perte'},
      {name: 'Rechercher un document', link: '/commons/rechercher', icon: 'file-earmark-arrow-up', tooltip: 'Rechercher un document'},
      {name: 'Rechercher un client', link: '/commons/rechercher_client', icon: 'binoculars-fill', tooltip: 'Rechercher un client'},
      {name: 'Géolocaliser', link: '/particulier/geolocalisation', icon: 'geo-alt', tooltip: 'Géolocaliser des recherches utilisateurs'},
      {name: 'Mes demandes', link: '/particulier/mes_demandes', icon: 'arrow90deg-right', tooltip: 'Mes demandes'},
      {name: 'Mes dossiers', link: '/commons/mes_dossiers', icon: 'collection-fill', tooltip: 'Mes dossiers'},
      {name: 'Notifications', link: '/commons/notifications', icon: 'bell-fill', tooltip: 'Mes notifications'},
      {name: 'Mon Compte', link: '/commons/compte', icon: 'person-fill', tooltip: 'Mon compte'},
      {name: 'Se déconnecter', link: '/logout', icon: 'power', tooltip: 'Deconnexion'},
    ]"
    :transparent="transparent"
  />

  <!-- For partners -->
  <BaseNavigationBar
    v-else-if="isLoggedInAsPartner"
    :links="[
      {name: 'Rechercher un document', link: '/commons/rechercher', icon: 'file-earmark-arrow-up', tooltip: 'Rechercher un document'},
      {name: 'Rechercher un client', link: '/commons/rechercher_client', icon: 'binoculars-fill', tooltip: 'Rechercher un client'},
      {name: 'Mes dossiers', link: '/commons/mes_dossiers', icon: 'collection-fill', tooltip: 'Mes dossiers'},
      {name: 'Notifications', link: '/commons/notifications', icon: 'bell-fill', tooltip: 'Mes notifications'},
      {name: 'Mon Compte', link: '/commons/compte', icon: 'person-fill', tooltip: 'Mon compte'},
      {name: 'Se déconnecter', link: '/logout', icon: 'power', tooltip: 'Deconnexion'},
    ]"
    :transparent="transparent"
  />

  <!-- For Admins -->
  <BaseNavigationBar
    v-else-if="isLoggedInAsAdmin"
    :links="[
      {name: 'Gestion des renouvellements et des documents perdus', link: '/admin/demands', icon: 'book-half', tooltip: 'Gestion des renouvellements et des documents perdus'},
      {name: 'Gestion des utilisateurs', link: '/admin/users', icon: 'people', tooltip: 'Gestion des utilisateurs'},
      {name: 'Statistiques', link: '/admin/charts', icon: 'graph-up', tooltip: 'Statistiques'},
      {name: 'Coffre', link: '/admin/lockdocument', icon: 'lock-fill', tooltip: 'Coffre'},
      {name: 'AriadNext', link: '/admin/ariadnext', icon: 'upc-scan', tooltip: 'AriadNext'},
      {name: 'Offrir des crédits', link: '/admin/offrir_credits', icon: 'gem', tooltip: 'Offrir des crédits à un utilisateur'},
      {name: 'Mon Compte', link: '/commons/compte', icon: 'person-fill', tooltip: 'Mon compte'},
      {name: 'Se déconnecter', link: '/logout', icon: 'power', tooltip: 'Deconnexion'},
    ]"
    :transparent="transparent"
  />

  <!-- Not logged in -->
  <BaseNavigationBar
    v-else
    :links="[
/*      {name: 'Espace particuliers', link: '/particulier/authentification', icon: 'person', tooltip: 'Membre'},
      {name: 'Espace professionnels', link: '/partenaire/authentification', icon: 'person-fill', tooltip: 'Partenaire'},
      {name: 'Intranet', link: '/admin/authentification', icon: 'shield-shaded', tooltip: 'Admin'},
 */   ]"
    :transparent="transparent"
  />
</template>

<script>
  import NotLoggedInNavbar from '~/components/commons/navbar/NotLoggedIn'
  import BaseNavigationBar from '~/components/commons/navbar/BaseNavigationBar'
  import { UserType } from "~/components/enums/userType";
  import mixinUser from "~/mixins/mixinUser";
  export default {
    name: 'Navbar',
    components: { BaseNavigationBar, NotLoggedInNavbar },
    mixins:[mixinUser],
    props: {
      transparent: { type: Boolean, required: false, default: false }
    },
    computed: {
      isLoggedIn () {
        return this.$store.state.authentication.type !== null
      },

      isLoggedInAsIndividual () {
        return this.$store.state.authentication.type === UserType.individual
      },

      isLoggedInAsPartner () {
        return this.$store.state.authentication.type === UserType.partner
      },

      isLoggedInAsAdmin () {
        return this.$store.state.authentication.type === UserType.admin
      },

      isUnknownUserType () {
        return this.$store.state.authentication.type && !this.isLoggedInAsIndividual && !this.isLoggedInAsPartner && !this.isLoggedInAsAdmin
      },

    },
  }
</script>
