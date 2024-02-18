<template>
  <div class="pt-5 my-5 d-flex flex-column justify-content-center align-items-center">
    <div>
      <b-alert class="mt-3" show variant="secondary">
        <h4>Confirmation de la demande</h4>
        <p>
          Cela va permettre au professionel d'accéder ou non à votre document
        </p>
      </b-alert>
    </div>
    <div v-if="this.error != null">
      <b-alert show variant="danger">
        {{ this.error }}
      </b-alert>
    </div>
    <div v-else-if="!this.isValidating">
      <b-alert show variant="success">
        {{ this.message }}
      </b-alert>
    </div>
  </div>
</template>

<script>
import { confirmRequest } from '../../api/documentrequests'
import { UserType } from '../../constants'
import UserMixin from '../../mixins/UserMixin'

export default {
  middleware: 'auth',
  mixins: [UserMixin],
  mounted () {
    this.$api.auth.getUser(UserType.individual)
      .then(() => {
        const { requestId, status } = this.$route.query

        if (!requestId || !status) {
          this.isValidating = false
          this.error = "Cette demande n'existe pas"
          return
        }

        confirmRequest(
          this.getCurrentUser.type,
          requestId,
          status
        )
          .then(async (response) => {
            this.isValidating = false

            const json = await response.json()
            if (response.status !== 200) {
              this.error = json.error
              return
            }

            this.message = 'Votre demande a bien été traitée'
          })
          .catch((e) => {
            this.isValidating = false
            this.error = e.error
          })
      })
  },
  data: () => {
    return {
      isValidating: true,
      message: '',
      error: null
    }
  }
}
</script>
