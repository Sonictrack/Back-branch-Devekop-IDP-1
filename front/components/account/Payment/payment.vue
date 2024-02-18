<template>
  <b-container class="payment text-center mt-3">
    <!-- <b-card header-tag="header" bg-variant="light" footer-tag="footer"> -->
    <div>
      <div>
        <p>Mode de paiements</p>
        <b-img
          :src="require('@/assets/images/credit_cards/visa.png')"
          class="icon-card"
          fluid
          alt="Carte Visa"
        ></b-img>
        <b-img
          :src="require('@/assets/images/credit_cards/cb.png')"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          :src="require('@/assets/images/credit_cards/ae.png')"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          :src="require('@/assets/images/credit_cards/mastercard.png')"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
        <b-img
          :src="require('@/assets/images/credit_cards/maestro.png')"
          class="icon-card"
          fluid
          alt="Carte bleue"
        ></b-img>
      </div>
      <div v-if="messageSuccess">
        <b-alert
          show
          variant="success"
          ><p>{{ messageSuccess }}</p></b-alert
        >
      </div>
      <div v-else class="mt-3">
        <div v-if="messageError">
          <b-alert
            show
            variant="danger">
            <p>{{ messageError }}</p>
          </b-alert>
        </div>
        <div>
          <div class="payment-loading" v-if="paymentSpinner">
            <strong>Paiement en cours...</strong>
            <b-spinner variant="primary" label="Spinning"></b-spinner>
          </div>
          <form @submit.prevent="onSubmit">
            <div ref="card">
              <!--Stripe.js injects the Card Element-->
            </div>
            <b-button
              type="submit"
              variant="secondary"
              block
              class="mt-3"
              v-if="this.amount"
              >
              Payer {{ amount }} €
              </b-button>
          </form>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'Paiement',
  props: ['amount', 'description', 'emailPayment', 'userInfo', 'credits'],
  data () {
    return {
      currency: 'eur',
      publicKey: '',
      clientSecret: '',
      messageSuccess: '',
      messageError: '',
      stripe: null,
      card: null,
      lockSubmit: true,
      paymentSpinner: false
    }
  },
  mounted () {
    this.getPaymentIntent()
  },
  methods: {
    paymentSuccess (value) {
      this.$emit('paymentSuccess', value)
    },
    buildCard () {
      const style = {
        base: {
          iconColor: '#c4f0ff',
          color: '#3f68b4',
          fontWeight: 500,
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#3f68b4'
          },
          '::placeholder': {
            color: '#3f68b4'
          }
        },
        invalid: {
          iconColor: '#e80e0e',
          color: '#e80e0e'
        }
      }
      /* eslint-disable-next-line */
      this.stripe = Stripe(this.publicKey)
      this.card = this.stripe.elements().create('card', { style })
      this.card.mount(this.$refs.card)
    },
    async getPaymentIntent () {
      try {
        if (!this.amount) {
          throw new Error('Anomalie lors du calcul du montant à payer!')
        }

        const data = {
          amount: this.amount,
          currency: this.currency,
          description: this.description,
          statement_descriptor: this.description.substr(0, 22)
        }

        if (!this.clientSecret) {
          const response = await this.$api.payment.getPaymentIntent(data)
          const { clientSecret, publicKey, error } = response

          if (error) {
            throw new Error(error)
          }

          this.clientSecret = clientSecret
          this.publicKey = publicKey
        }

        this.buildCard()
        this.lockSubmit = false
      } catch (e) {
        this.messageError = e.message
      }
    },
    async onSubmit () {
      try {
        event.preventDefault()
        this.paymentSpinner = true
        this.messageError = '' 
        const { error } = await this.stripe.confirmCardPayment(
          this.clientSecret,
          {
            payment_method: {
              card: this.card,
              billing_details: {
                name: this.userInfo.firstname+" "+this.userInfo.lastname,
                email: this.emailPayment,
                phone: this.userInfo.phoneNumber  
              }
            }
          }
        )
        if (error) {
          throw new Error(error.message)
        }

        let response = null
        if (this.$store.state.authentication && this.$store.state.authentication.type !== null) {
          response = await this.$api.payment.emailAfterPayment(this.$store.state.authentication.type, this.amount, this.credits)
        }else if (this.$store.state.auth && this.$store.state.auth.user && this.$store.state.auth.user.type !== null) {
          response = await this.$api.payment.emailAfterPayment(this.$store.state.auth.user.type, this.amount, this.credits)
         } else {
          response = await this.$api.payment.emailAfterPaymentAnonymous(
            this.emailPayment,
            this.amount, 
            this.credits
          )
        }
        const json = await response.success

        if (!json) {
          throw new Error('Erreur de Paiement.')
        }

        this.messageError = ''
        this.messageSuccess = json
        this.paymentSuccess(true)
      } catch (e) {
        this.messageError = e.message
      } finally {
        this.paymentSpinner = false
      }
    }
  }
}
</script>

<style scoped>
.payment {
  border: 1px solid #3963AB;
}

.payment-loading {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 3vh;
  margin-bottom: 3vh;
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
}

button :hover {
  background-color: #333333;
  cursor: pointer;
}

button .disabled {
  background-color: gray;
}

.icon-card {
  width: 40px;
  height: 30px;
  padding: 5px;
}
</style>
