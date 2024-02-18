<template>
    <b-card
      bg-variant="light"
      border-variant="secondary"
      footer-tag="footer"
      class="text-left"
    >
      <b-form-group label-for="id-client">
        <h5>Numéro du client</h5>
        <b-form-input
          id="id-client"
          size="sm"
          placeholder="Numéro client IXXXXXXX"
          v-model="id"
          :state="validateNumeroClient"
          aria-describedby="input-live-feedback"
          maxlength=9
          trim
        ></b-form-input>
        <b-form-invalid-feedback
          id="input-live-feedback"
        >Saisissez un numéro client valide IXXXXXXXX</b-form-invalid-feedback>
      </b-form-group>

      <template v-slot:footer>
        <div class="text-center">
          <b-avatar button id="search-client" name="search-client" icon="search" class="align-center" variant="primary" font-scale="2" @click="rechercher" :disabled="!validateNumeroClient"></b-avatar>
          <b-popover target="search-client" triggers="hover" placement="top" variant="primary">
            Lancer la recherche
          </b-popover>
        </div>
      </template>
    </b-card>
</template>

<script>
import { searchFoldersByIdClient } from "~/api/folder";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

export default {
  name: "SearchClientForm",
  mixins: [mixinMessages],
  data() {
    return {
      id: "",
    };
  },
  computed: {
    validateNumeroClient() {
      if(this.id){
        this.id = this.id.toUpperCase()
        return this.id.match(/^[I][0-9]{8}/) !== null
      }
      return false
    }
  },
  methods: {
    async rechercher() {
      try {
        const resultSearch = await searchFoldersByIdClient(this.$store.state.authentication.type, this.id);        
        const jsonResult = await resultSearch.json();

        if (jsonResult.error){
          throw new Error(jsonResult.error);
        }

        this.$emit("result", jsonResult);
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    }
  }
};
</script>