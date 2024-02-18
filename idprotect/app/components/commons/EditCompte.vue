<template>
  <b-form class="mt-3">
    <b-container class="d-flex justify-content-center">
          <b-card
            footer-tag="footer"
            border-variant="secondary"
            style="max-width: 40rem;"
            title="Modifier mon compte"
          >
          <hr>
              <b-list-group>
                <b-list-group-item>
                  <div class="d-flex w-100 justify-content-between">
                  <b-avatar variant="info" icon="person-fill" class="align-baseline mr-3"></b-avatar>
                  <b-form-group id="firstname-group" label-for="firstname" class="mr-3">
                    <b-form-input
                      id="firstname"
                      name="firstname"
                      v-model="$v.form.firstname.$model"
                      :state="validateState('firstname')"
                      aria-describedby="input-firstname-live-feedback"
                      trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-firstname-live-feedback">Veuillez saisir le prénom.</b-form-invalid-feedback>
                  </b-form-group>

                  <b-form-group id="lastname-group" label-for="lastname" class="mr-3">
                    <b-form-input
                      id="lastname"
                      name="lastname"
                      v-model="$v.form.lastname.$model"
                      :state="validateState('lastname')"
                      aria-describedby="input-lastname-live-feedback"
                      trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-lastname-live-feedback">Veuillez saisir le nom.</b-form-invalid-feedback>
                  </b-form-group>
                  </div>
                </b-list-group-item>
                <b-list-group-item v-if="isPartner">
                  <div class="d-flex w-100 justify-content-start">
                  <b-avatar variant="info" icon="building" class="align-center mr-3"></b-avatar>
                  <b-form-group id="companyName-group" label-for="companyName" class="mr-3">
                    <b-form-input
                      id="companyName"
                      name="companyName"
                      v-model="$v.form.companyName.$model"
                      :state="validateState('companyName')"
                      aria-describedby="input-companyName-live-feedback"
                      trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-companyName-live-feedback">Veuillez saisir le nom de la société.</b-form-invalid-feedback>
                  </b-form-group>
                  </div>
                </b-list-group-item>
                <b-list-group-item v-if="isPartner">
                  <div class="d-flex w-100 justify-content-start">
                  <b-avatar variant="info" icon="telephone" class="align-center mr-3"></b-avatar>
                  <b-form-group id="phoneNumber-group" label-for="phoneNumber" class="mr-3">
                    <b-form-input
                      id="phoneNumber"
                      name="phoneNumber"
                      v-model="$v.form.phoneNumber.$model"
                      :state="validateState('phoneNumber')"
                      aria-describedby="input-phoneNumber-live-feedback"
                      trim
                    ></b-form-input>
                    <b-form-invalid-feedback id="input-phoneNumber-live-feedback">Veuillez saisir le numéro de téléphone.</b-form-invalid-feedback>
                  </b-form-group>
                  </div>
                </b-list-group-item>
              </b-list-group>

            <template v-slot:footer>
              <div class="text-center">
                <b-avatar button  icon="check2" class="align-center mr-3" variant="success" font-scale="2" @click="updateAccount" :disabled="$v.form.$invalid"></b-avatar>
                <b-avatar button  icon="x" class="align-center mr-3" variant="danger" font-scale="2" @click="closeEdit(false)"></b-avatar>
              </div>
            </template>

        </b-card>
    </b-container>
  </b-form>
</template>

<script>
import Vue from "vue";
import { updateAccount } from "~/api/account"
import mixinUser from "~/mixins/mixinUser"
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { Action } from '~/components/enums/action'
import { UserType } from "~/components/enums/userType"
import { validationMixin } from "vuelidate";
import {
  required,
  numeric,
  email
} from "vuelidate/lib/validators";


const EditCompte = Vue.extend({
  name: "EditCompte",
  props: ["data"],
  mixins: [validationMixin, mixinUser, mixinMessages],
  data(){
      return{
          form: {
          firstname: null,
          lastname: null,
          companyName: null,
          phoneNumber: null
        },
      }
  },
  validations: {
    form: {
      id:{
      },
      firstname: {
        required
      },
      lastname: {
        required
      },
      companyName: {        
      },
      phoneNumber: {
        numeric
      },
    },
  },
  beforeMount(){
    this.feedForm()
  },
  computed: {
    isPartner(){
      return this.data.type === UserType.partner;
    },
  },
  methods: {
    feedForm(){
        if(this.data){
          this.form.id = this.data.id,
          this.form.firstname = this.data.firstname,
          this.form.lastname = this.data.lastname,
          this.form.companyName = this.data.companyName,
          this.form.phoneNumber = this.data.phoneNumber
        }
    },
    validateState(field) {
      const { $dirty, $error } = this.$v.form[field];
      return $dirty ? !$error : null;
    },
    async updateAccount() {
      try {

        const response = await updateAccount(this.$store.state.authentication.type, this.form)
        const json = await response.json()

        if (json.error) {
          throw new Error(json.error)
        }

        this.makeToast('Succès', "Le compte a été mis à jour avec succès!", TOAST_MESSAGE_VARIANT.SUCCESS);

        this.closeEdit(true)
      } catch (e) {
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
    closeEdit(update) {
      this.$emit("update", update)     
    },
  },
})
export default EditCompte;
</script>
