<template>
  <b-container class="text-center mt-3">
    <b-card header-tag="header" bg-variant="light" footer-tag="footer" border-variant="primary">
      <template v-slot:header>
        <p>Mode de paiements</p>
        <b-img
          src="../../../assets/visa.png"
          class="icon-card"
          fluid
          thumbnail
          alt="Carte Visa"
        ></b-img>
        <b-img
          src="../../../assets/cb.png"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          src="../../../assets/ae.png"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          src="../../../assets/mastercard.png"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          src="../../../assets/maestro.png"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
      </template>
      <div v-if="messageSuccess">
        <b-alert show variant="success"
          ><p>{{ messageSuccess }}</p></b-alert
        >
      </div>
      <div v-else class="mt-3">
        <div v-if="messageError">
          <b-alert show variant="danger"
            ><p>{{ messageError }}</p></b-alert
          >
        </div>
        <div>
          <div v-if="paymentSpinner">
            <strong>Paiement en cours...</strong>
            <b-spinner variant="primary" label="Spinning"></b-spinner>
          </div>
          <form @submit.prevent="onSubmit">
            <div ref="card">
              <!--Stripe.js injects the Card Element-->
            </div>
            <b-button
              type="submit"
              block
              variant="secondary"
              class="mt-3"
              :disabled="lockSubmit"
              v-if="this.amount"
              >Payer {{ amount }} €</b-button
            >
          </form>
        </div>
      </div>
    </b-card>
    <div class="text-center">
      <b-icon
        id="back"
        icon="arrow-left-circle"
        class="arrow-style rounded p-2"
        variant="secondary"
        @click="goNextStep(false)"
        v-if="!messageSuccess"
      ></b-icon>
      <b-popover v-if="!messageSuccess" target="back" triggers="hover" placement="top" variant="primary">
        Précédent
      </b-popover>
      <b-icon
        id="end-payment"
        icon="arrow-right-circle"
        class="arrow-style rounded p-2"
        variant="success"
        @click="goNextStep(true)"
        v-if="messageSuccess"
      ></b-icon>
      <b-popover v-if="messageSuccess" target="end-payment" triggers="hover" placement="top" variant="primary">
        Terminer
      </b-popover>
    </div>
  </b-container>
</template>

<script>
import Vue from "vue";
import { paymentIntent, emailAfterPaymentAnonymous, emailAfterPayment } from "~/api/payment";

const Paiement = Vue.extend({
  name: "Paiement",
  props: ["amount", "description", "emailPayment"],
  data() {
    return {
      // amount: 45,
      // description: "Renouvellement",
      // emailPayment: "xxxx@hotmail.com",
      currency: "eur",
      publicKey: "",
      clientSecret: "",
      messageSuccess: "",
      messageError: "",
      stripe: null,
      card: null,
      lockSubmit: true,
      paymentSpinner: false
    };
  },
  mounted() {
    this.getPaymentIntent();
  },
  methods: {
    paymentSuccess(value) {
      this.$emit("paymentSuccess", value);
    },
    goNextStep(value) {
      this.$emit("nextStep", value);
    },
    buildCard() {
      const style = {
        base: {
          iconColor: '#c4f0ff',
          color: '#3f68b4',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#3f68b4',
          },
          '::placeholder': {
            color: '#3f68b4',
          },
        },
        invalid: {
          iconColor: '#e80e0e',
          color: '#e80e0e',
        },
      };
      this.stripe = Stripe(this.publicKey);
      this.card = this.stripe.elements().create("card", { style: style });
      this.card.mount(this.$refs.card);
    },
    async getPaymentIntent() {
      try {
        if (!this.amount)
          throw new Error("Anomalie lors du calcul du montant à payer!");

        const data = {
          amount: this.amount,
          currency: this.currency,
          description: this.description,
          statement_descriptor: this.description.substr(0, 22),
        };

        if (!this.clientSecret) {
          const response = await paymentIntent(data);
          const { clientSecret, publicKey, error } = await response.json();

          if (error)
            throw new Error(error);

          this.clientSecret = clientSecret;
          this.publicKey = publicKey;
        }

        this.buildCard();
        this.lockSubmit = false;
      } catch (e) {
        this.messageError = e.message;
      }
    },
    async onSubmit() {
      try {
        event.preventDefault();
        this.paymentSpinner = true
        this.messageError = "";
        this.messageSuccess = "";

        const { paymentIntent, error } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          {
            payment_method: { card: this.card },
          }
        );
        if (error)
          throw new Error(error.message);

        let response = null;

        if (this.$store.state.authentication.type !== null) {
          response = await emailAfterPayment(this.$store.state.authentication.type, this.amount);
        } else {
          response = await emailAfterPaymentAnonymous(
            this.emailPayment,
            this.amount
          );
        }
        const json = await response.json();

        if (json.error){
            throw new Error(json.error);
        }

        this.messageError = "";
        this.messageSuccess = json.success;
        this.paymentSuccess(true)
      } catch (e) {
        this.messageError = e.message;
      }finally{
        this.paymentSpinner = false
      }
    },
  },
});
export default Paiement;
</script>

<style scoped>
.icon-card {
  width: 36px;
  height: 24px;
}
</style>
