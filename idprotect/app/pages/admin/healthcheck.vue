<template>
  <div class="mt-3">
      <b-alert show>      
        Santé du backend : 
        <b-icon icon="exclamation-circle-fill" variant="success" v-if="health"></b-icon>
        <b-icon icon="exclamation-circle-fill" variant="danger" v-else></b-icon>
      </b-alert>
  </div>
</template>

<script>
import { healthCheck } from "~/api/maintenance"

export default {
    name: "healthcheck",
    middleware: "notAuthenticated",
    data() {
        return {
            health: false
        }
    },
    mounted(){
        this.check()
    },
    methods:{
        async check(){
            try{
                const response = await healthCheck()
                this.health = response.status === 200
            } catch(e) {
                this.health = false
            }
        }
    }
}
</script>

<style scoped></style>
