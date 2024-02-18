<template>
  <CustomForm :title="`Inscription ${name}`"
              buttonLabel="S'inscrire"
              :inputTypes="inputs"
              :globalErrors="globalErrors"
              :buttonClasses="['btn-secondary']"
              @submit="onSubmit"
  >
    <slot></slot>
  </CustomForm>
</template>

<script lang="ts">
  import Vue from 'vue'
  import CustomForm from '~/components/commons/access/CustomForm.vue'
  import mixinUser from "~/mixins/mixinUser";
  import mixinMessages from "~/mixins/mixinMessages";
  import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
  import { Action } from '~/components/enums/action'
  
  const baseInputs: InputProps[] = [{
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'adresse@mail.com',
    possibleErrors: [{
      name: 'email-exists',
      description: 'Entrez une adresse mail valide.',
      validator: inputs => {
        return !!inputs.email.value.match(/.+@.+\..+/)
      },
    }],
  }, {
    type: 'password',
    name: 'password',
    label: 'Mot de passe',
    placeholder: '*******',
    possibleErrors: [{
      name: 'password-length',
      description: 'Au moins 8 caractères.',
      validator: inputs => {
        return inputs.password.value.length >= 8
      },
    }, {
      name: 'password-letter',
      description: 'Une lettre.',
      validator: inputs => {
        return inputs.password.value.search(/[a-zA-Z]/) > -1
      },
    }, {
      name: 'password-number',
      description: 'Un chiffre.',
      validator: inputs => {
        return inputs.password.value.search(/[0-9]/) > -1
      },
    }],
  }, {
    type: 'password',
    name: 'passwordConfirm',
    label: 'Confirmez votre mot de passe',
    placeholder: '*******',
    possibleErrors: [{
      name: 'password-equals',
      description: 'Vos mots de passe doivent être identiques.',
      validator: inputs => {
        return inputs.password.value === inputs.passwordConfirm.value
      },
    }],
  }]

  const RegistrationForm = Vue.extend({
    name: 'RegistrationForm',
    mixins: [mixinMessages, mixinUser],
    components: { CustomForm },

    props: {
      additionalInputs: { type: Array, required: false, default: () => [] },
      additionalErrorDescriptions: { type: Array, required: false, default: () => [] },
      registerFunction: { type: Function, required: true },
      name: { type: String, required: true },
      userValueType: { type: String, required: true }
    },

    data () {
      return {
        inputs: this.additionalInputs
          .concat(baseInputs)
          .map(input => Object.assign({}, input, { valid: false, value: '' })) as FormInput[],
        globalErrors: [],
      }
    },

    methods: {
      async onSubmit (inputs: any) {
        let data = inputs.reduce((result: any, input: any) => {
          result[input.name] = input.value
          return result
        }, {})

        try {
          data.type = this.userValueType
          delete data.passwordConfirm

          const response = await this.registerFunction(data)
          const { success, error } = await response.json()

          if(error){
            throw new Error(error)
          }

          this.$emit('successfulRegistration', success)
        }
        catch (e) {
          // @ts-ignore
          this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
        }
      },
    },
  })

  export default RegistrationForm
</script>