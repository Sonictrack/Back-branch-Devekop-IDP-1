<template>
  <div class="mt-3">
      <b-alert show variant="secondary">
        <h4 >Notifications</h4>
        <p>
          Ici sont enregistrés toutes vos actions et celles des partenaires concernant des demandes d'autorisation.
        </p>
      </b-alert>
    <hr />
    <Notifications />
  </div>
</template>

<script>
import Vue from "vue";
import Notifications from "~/components/commons/Notifications";

const NotificationsPage = Vue.extend({
  name: "notifications",
  middleware: "authenticated",
  components: { Notifications },
});

export default NotificationsPage;
</script>
