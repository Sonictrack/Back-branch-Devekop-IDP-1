<template>
  <div class="mb-3 text-center w-50 container">
    <b-button
      :disabled="resultFound != null"
      :class="visible ? null : 'collapsed'"
      :aria-expanded="visible ? 'true' : 'false'"
      aria-controls="collapse-form"
      @click="openSearch"
    >
      <b-icon :icon="switchIcon"></b-icon>
      <em>{{iconText}}</em>
    </b-button>

    <SpinnerDataDownload :isBusy="isBusy" :spinMessage="spinnerMessage" :color="spinnerColor"/>

    <b-collapse id="collapse-form" v-model="visible" class="mt-5 center-card">
      <transition name="flip" mode="out-in">
        <component
          :resultFound="resultFound"
          :is="mode"
          @result="resultForm($event)"
          @confirmed="mode = 'SearchClientResult'"
        ></component>
      </transition>
    </b-collapse>

    <div class="mt-5">
      <AuthorizedFolders :individualsFolders="folders" @refreshData="refresh($event)" v-if="!visible"></AuthorizedFolders>
    </div>

  </div>
</template>

<script>
import { getClientsFolders } from "~/api/folder";
import SearchClientForm from "~/components/commons/search/SearchClientForm";
import SearchClientResult from "~/components/commons/search/SearchClientResult";
import AuthorizedFolders from "~/components/commons/folders/AuthorizedFolders";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import SpinnerDataDownload from "~/components/commons/utils/SpinnerDataDownload";
import mixinUser from '../../../mixins/mixinUser';

export default {
  name: "SearchClient",
  mixins: [mixinMessages, mixinUser],
  components: {
    SearchClientForm,
    SearchClientResult,
    AuthorizedFolders,
    SpinnerDataDownload
  },
  data() {
    return {
      isBusy: true,
      spinnerMessage: "Chargement des données...",
      spinnerColor: "primary",
      visible: false,
      resultFound: null,
      mode: "SearchClientForm",
      folders: []
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(result)
          this.onLoadPage()
        else
          this.logout()
    })
  },
  computed:{
    switchIcon(){
      return this.visible ? 'folder' : 'person-bounding-box'
    },
    iconText(){
      return this.visible ? 'Afficher mes dossiers' : 'Rechercher un client'
    }
  },
  methods: {
    openSearch() {
      this.visible = !this.visible;
      if(!this.visible)
        this.onLoadPage();
    },
    async onLoadPage() {
      try {
        this.isBusy = true;
        const response = await getClientsFolders(this.$store.state.authentication.type);
        if(response.status === 401)
          this.logout()

        const json = await response.json();

        if (json.error){
          throw new Error(json.error)
        }

        this.folders = json.result;
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }finally{
        this.isBusy = false;
      }
    },
    resultForm(resultFound) {
      if (resultFound != null) {
        this.resultFound = resultFound;
        this.mode = "SearchClientResult";
      } else {
        this.resultFound = null;
        this.mode = "SearchClientForm";
      }
    },
    refresh(isRefreshData){
      if(isRefreshData)
        this.onLoadPage();
    }
  },
};
</script>

<style scoped>
.center-card {
  margin: auto;
  width: 35rem;
  border: 0px;
  padding: 0px;
}

.flip-enter-active {
  animation: flip-in 0.5s ease-out forwards;
}

.flip-leave-active {
  animation: flip-out 0.5s ease-out forwards;
}

@keyframes flip-out {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(90deg);
  }
}

@keyframes flip-in {
  from {
    transform: rotateX(90deg);
  }
  to {
    transform: rotateX(0deg);
  }
}
</style>