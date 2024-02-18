<template>
<div>
  <!-- <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="credits-pagination"
      align="center"
      pills
      size="sm"
      class="mt-3"
  ></b-pagination> -->
  <!-- <hr /> -->
  <b-table
      id="credits-pagination"
      striped
      hover
      :items="logs"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      v-if="!isBusy"
    >
  </b-table>
</div>
</template>

<script>
import { getGivenCreditsHistory } from '../../api/payment'
  export default {
    name: "OfferCreditsHistory",
    data() {
      return {
        currenPage: 1,
        perPage: 7,

        logs: [],
        fields: [
          {
            key: "addedCredits",
            label: "Nombre de crédits ajoutés"
          },
          {
            key: "issuer.email",
            label: "Utilisateur"
          }
        ]
      }
    },
    mounted() {
      this.getHistory()
    },
    computed: {
      rows() {  
        this.items = this.logs.slice(
          this.perPage * this.currentPage - this.perPage,
          this.perPage * this.currentPage
        );
        return this.logs.length;
      },
    },
    methods: {
      async getHistory() {
        const response = await getGivenCreditsHistory(
          this.$store.state.authentication.type
        )

        const json = await response.json();
        if (response.status !== 200) {
          return;
        }

        this.logs = json.logs;
      }
    }
  }
</script>
