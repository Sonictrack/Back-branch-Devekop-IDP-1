<template>
    <b-container class="align-middle w-50 shadow p-3 mb-5 bg-white rounded">
            <div class="text-center">
              <Alerte :messageSuccess="messageSuccess" :messageError="messageError" />
            </div>   
          <form @click.prevent="onSubmit" v-if="!messageSuccess">
            <b-form-group
              id="password-group"
              label="Mot de passe"
              label-for="password"
            >
              <b-form-input
                id="password"
                name="password"
                type="password"
                v-model="$v.form.password.$model"
                :state="validateState('password') && goodPassword($v.form.password.$model)"
                aria-describedby="input-password-live-feedback"
                trim
              ></b-form-input>
              <b-form-invalid-feedback
                id="input-password-live-feedback"
              >Ce champs est vide ou ne respecte pas le niveau de sécurité.</b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              id="password2-group"
              label="Confirmez le mot de passe"
              label-for="password2"
            >
              <b-form-input
                id="password2"
                name="password2"
                type="password"
                v-model="$v.form.password2.$model"
                :state="validateState('password2')"
                aria-describedby="input-password2-live-feedback"
                trim
              ></b-form-input>
              <b-form-invalid-feedback
                id="input-password2-live-feedback"
              >Ce champs est vide ou les mots de passe ne sont pas identiques.</b-form-invalid-feedback>
            </b-form-group>
            <b-button type="submit" class="btn-block" variant="secondary  " :disabled="$v.form.$invalid">Valider</b-button>
      </form>
    </b-container>
</template>

<script>
import Vue from "vue"
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import mixinForm from "~/mixins/mixinForm";
import { validationMixin } from "vuelidate"
import { resetPassword } from "~/api/user"
import { required, sameAs } from "vuelidate/lib/validators";
import Alerte from "~/components/commons/utils/Alerte"

const Password = Vue.extend({
  name: "Password",
  mixins: [validationMixin, mixinMessages, mixinForm],
  components: { Alerte },
  data() {
    return {
      messageSuccess: null,
      messageError: null,
      form: {
        password: null,
        password2: null
      }
    }
  },
  validations: {
    form: {
      password: {
        required,
      },
      password2: {
        required,
        sameAs: sameAs("password"),
      },
    }
  },
  methods: {
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field]
      return $dirty ? !$error : null
    },
    async onSubmit() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return
      }

      try {
        if(!this.$route.query.p){
          throw new Error("Ce lien n'est pas ou plus valide!")
        }
        const token = this.$route.query.p
        const response = await resetPassword(token, this.form.password)
        const result = await response.json()

        if (result.error) {
          throw new Error(result.error)
        }

        this.messageError = null
        this.messageSuccess = result.success

      } catch (e) {
        this.messageSuccess = null
        this.messageError = e.message
      }
    }
  }
})
export default Password
</script>