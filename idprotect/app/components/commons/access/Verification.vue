<template>
  <div class="main-container">
    <div class="form-container" ref="formContainer">
    <form @click.prevent="onSubmit">
            <h1 class="title text-center">Vérifier votre compte ou réinitialiser votre mot de passe</h1>
              <Alerte :messageSuccess="messageSuccess" :messageError="messageError" />

            <b-form-group id="email-group" label="Email :" label-for="email">
              <b-form-input
                id="email"
                name="email"
                type="email"
                v-model="$v.form.email.$model"
                :state="validateState('email')"
                aria-describedby="input-email-live-feedback"
                trim
              ></b-form-input>
              <b-form-invalid-feedback
                id="input-email-live-feedback"
              >Ce champs est vide ou l'email est incorrect.</b-form-invalid-feedback>
            </b-form-group>
            <div>
              <b-button id="verify_account" name="verify_account" type="submit" variant="secondary" :disabled="$v.form.$invalid">Vérifier votre compte</b-button>
              <b-button id="password_lost" name="password_lost" type="submit" variant="secondary" :disabled="$v.form.$invalid">Réinitialiser votre mot de passe</b-button>
            </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import { required, minLength, email, sameAs, alphaNum } from "vuelidate/lib/validators"

import mixinMessages from "~/mixins/mixinMessages";
import { validationMixin } from "vuelidate"
import { resend } from "~/api/user"

import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import Alerte from "~/components/commons/utils/Alerte"

const Verification = Vue.extend({
  name: "Verification",
  mixins: [validationMixin, mixinMessages],
  components: { Alerte },
  data() {
    return {
      messageSuccess: null,
      messageError: null,
      form: {
        email: null
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email,
      }
    }
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field]
      return $dirty ? !$error : null
    },
    resetForm() {
      this.messageSuccess = null,
      this.messageError = null,
      this.form = {
        email: null
      }
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    async onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return
      }

      try {
        let response = null
        const buttonName = event.target.name
        if(buttonName === 'verify_account'){
          response = await resend(this.form.email, 'v')
        } else {
          response = await resend(this.form.email, 'p')
        }

        const result = await response.json()

        if (result.error) {
          throw new Error(result.error)
        }

        this.messageError = null
        this.messageSuccess = result.success

      } catch (e) {
        this.messageError = e.message
        this.messageSuccess = null
      }
    }
  }
})
export default Verification
</script>

<style scoped lang="scss">
  .main-container {
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-container {
    width: 100%;
    @media (min-width: 768px) {
      width: 600px;
    }
    max-height: 90%;
    padding: 65px 55px 50px;
    background: #fff;
    border-radius: 10px;
    overflow-y: auto;
    box-shadow: 0 3px 20px 0 rgba(0, 0, 0, 0.1);
  }

  h1 {
    display: block;
    font-size: 30px;
    color: #555555;
    line-height: 1.2;
    text-align: center;
    padding-bottom: 33px;
  }

  button {
    outline: none !important;
    border: none;
    margin-top: 20px;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 60px;
    background-color: #4272d7;

    font-size: 14px;
    color: #fff;
    line-height: 1.2;
    text-transform: uppercase;

    transition: all 0.4s;

    &:hover {
      background-color: #333333;
      cursor: pointer;
    }

    &.disabled {
      background-color: gray;
    }
  }

 .form-footer {
    padding: 20px 55px 0;
  }

  .submit-button {
    transition: all 0.2s;
  }
</style>
