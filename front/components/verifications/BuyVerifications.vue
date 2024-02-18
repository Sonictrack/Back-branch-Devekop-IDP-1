<template>
  <div id="professionals_area" class="pink-theme">
    <section
      v-if="!this.isPaying"
      class="my-5 d-flex flex-column align-items-center"
    >
      <h2 class="pt-5 text-center">Choisissez votre pack</h2>

      <div class="mt-5 d-flex justify-content-center">
        <button
          @click="
            () => {
              this.type = 'pack1';
              this.amount = 10;
              this.credits = 5;
            }
          "
          :class="this.classes('pack1')"
        >
          5 Vérifications: 10€
        </button>
        <button
          @click="
            () => {
              this.type = 'pack2';
              this.amount = 18;
              this.credits = 10;
            }
          "
          :class="this.classes('pack2')"
        >
          10 Vérifications: 18€
        </button>
        <button
          @click="
            () => {
              this.type = 'pack3';
              this.amount = 33;
              this.credits = 20;
            }
          "
          :class="this.classes('pack3')"
        >
          20 Vérifications: 33€
        </button>
      </div>

      <button
        @click="() => (this.isPaying = true)"
        class="mt-5 btn btn-border text-uppercase"
      >
        Acheter ce pack
      </button>
    </section>

    <section class="my-5 pt-5" v-if="this.isPaying">
      <Payment
        :amount="this.amount"
        :credits="this.credits"
        :description="`Achat de ${this.credits} crédits`"
        :emailPayment="this.userEmail"
        :userInfo="this.userInfo"
        @paymentSuccess="this.onPaymentSuccess"
      />
    </section>
  </div>
</template>

<script>
import { addCreditsToUser } from '../../api/credits'
import MessagesMixin from '../../mixins/MessagesMixin'
import UserMixin from '../../mixins/UserMixin'
import Payment from '../account/Payment/payment.vue'

/*
 * ClientLogin component
 */
export default {
  name: 'BuyVerifications',
  mixins: [UserMixin, MessagesMixin],
  components: {
    Payment
  },
  mounted () {
    this.fetchAccount()
  },
  data: () => {
    return {
      type: '',
      isPaying: false,
      amount: 0,
      credits: 0,
      userEmail: '',
      userInfo:null
    }
  },
  methods: {
    async fetchAccount () {
      /*const response = await this.$api.auth.getUser(
        this.getCurrentUser.type
      )

      if (response.status === 401) {
        this.logout()
      }

      const json = await response.json()*/
      this.userEmail = this.getCurrentUser.email
      this.userInfo =  this.getCurrentUser
      //this.userEmail = json.email
    },
    redirect() {
      let url = "";
      if (this.getCurrentUser.type === "individual") {
        url = `/particuliers/espace-client`;
      } else if (this.getCurrentUser.type === "partner") {
        url = `/professionnels/espace-client`;
      }
      this.$router.push(url);
    },
    async onPaymentSuccess () {
      const response = await addCreditsToUser(
        this.getCurrentUser.type,
        this.credits,
        this.amount
      )

      const json = await response.json()
      if (json.error) {
        this.makeToast('Anomalie', json.error, 'danger')
        return
      }

      this.makeToast(
        'Succès',
        'Vos crédits ont bien été crédités sur votre compte',
        'success'
      )
      setTimeout(() => {
        this.redirect()
      }, 2000)
    },
    classes (btnType) {
      if (btnType === this.type) {
        return 'btn btn-pink text-uppercase mx-2'
      }

      return 'btn btn-border text-uppercase mx-2'
    }
  }
}
</script>
