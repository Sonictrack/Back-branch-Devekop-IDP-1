<template>
    <div class="d-flex justify-content-center align-items-center text-center">
      <Alerte :messageSuccess="messageSuccess" :messageError="messageError" />
    </div>
</template>

<script>
import { userConfirmation } from "~/api/user"
import Alerte from "~/components/commons/utils/Alerte"

export default {
    name: 'Confirmation',
    components: { Alerte },
    data() {
        return {
            messageSuccess: null,
            messageError: null
        }
    },
    beforeMount(){
        this.checkConfirmation()
    },
    methods: {
        async checkConfirmation() {
        try {
            if(!this.$route.query.v){
                this.$router.push("/")
            }

            const token = this.$route.query.v
            const response = await userConfirmation(token)
            const json = await response.json()

            if (json.error) {
                throw new Error(json.error)
            }
            this.messageError = null
            this.messageSuccess = json.success

          } catch (e) {
              this.messageSuccess = null
              this.messageError = e.message
          }
        }
    }
  }
</script>
