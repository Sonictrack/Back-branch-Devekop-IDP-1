<template>
  <CustomForm :title="`Connexion ${name}`"
              buttonLabel="Se connecter"
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

  export default {
    name: 'LoginForm',
    components: { CustomForm },
    props: {
      name: { type: String, required: true },
      loginFunction: { type: Function, required: true },
      userValueType: { type: String, required: true }
    },

    data () {
      return {
        inputs: [
          {
            type: 'email',
            name: 'email',
            label: 'Email',
            placeholder: 'adresse@mail.com',
          },
          {
            type: 'password',
            name: 'password',
            label: 'Mot de passe',
            placeholder: '*******',
          }
        ],
        globalErrors: []
      }
    },

    methods: {
      async onSubmit (inputs) {
        try {
          let data = inputs.reduce((result, input) => {
            result[input.name] = input.value
            return result
          }, {})


          data.type = this.userValueType
          let response = await this.loginFunction(data)
          const result = await response.json()

          if (response.status === 401) {
            return this.globalErrors = [result.error]
          }

          if (result.error) {
            throw new Error(result.error)
          }

          this.$emit('successfulLogin', result)
        } catch (e) {
          this.globalErrors = [e.message]
        }
      },
    }
  }
</script>