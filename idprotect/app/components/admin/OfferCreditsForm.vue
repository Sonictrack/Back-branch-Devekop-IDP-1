<template>
  <CustomForm title="Offrir des crédits"
    buttonLabel="Ajouter des crédits"
    :inputTypes="inputs"
    :globalErrors="globalErrors"
    :buttonClasses="['btn-secondary']"
    @submit="onSubmit"
  >
    <slot></slot>
  </CustomForm>
</template>

<script>
import CustomForm from '~/components/commons/access/CustomForm.vue'
import { giveCredits } from '../../api/payment'
import { TOAST_MESSAGE_VARIANT } from '../enums/messageToast'

export default {
  name: "OfferCreditsForm",
  components: { CustomForm },
  data() {
    return {
      inputs: [
        {
          type: "email",
          name: 'email',
          label: 'Email',
          placeholder: 'adresse@mail.com',
        },
        {
          type: "number",
          name: "credits",
          label: "Nombre de crédits à ajouter",
          placeholder: "Nombre de crédits"
        }
      ],
      globalErrors: []
    }
  },
  methods: {
    async onSubmit(inputs) {
      try {
        let data = inputs.reduce((result, input) => {
          result[input.name] = input.value
          return result
        }, {})

        if (!data.credits) {
          return
        }

        const response = await giveCredits(
          this.$store.state.authentication.type,
          data.email,
          data.credits
        )
        const result = await response.json()

        if (response.status === 401) {
          return this.globalErrors = [result.error]
          // return;
        }

        if (result.error) {
          throw new Error(result.error)
        }

        this.makeToast("Succès", "Les crédits ont bien été ajoutés à l'utilisateur", TOAST_MESSAGE_VARIANT.SUCCESS)
      } catch (e) {
        this.globalErrors = [e.message]
      }
    }
  }
}
</script>