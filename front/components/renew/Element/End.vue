<template>
  <div class="End">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <div v-for="el, elIndex in getText" :key="elIndex" class="mb-8">
        <header v-if="el !== null" class="bg-primary text-white p-2 font-weight-bold">
          {{ el.title }}
        </header>
        <div v-if="elIndex !== 'nationality'">
          <div v-for="line, lineIndex in el.list" :key="lineIndex" class="my-2">
            <div v-if="hasForm[lineIndex]" class="row">
              <div class="col-6 font-weight-bold">
                {{ line }}
              </div>
              <div class="col-6">
                <span>{{ hasForm[lineIndex] }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row">
          <div class="col-6 font-weight-bold my-2">
            Vous êtes français parce que:
          </div>
          <div class="col-6 my-2">
            {{ findReasons(hasForm.nationality) }}
          </div>
        </div>
      </div>
    </v-form>
    <div>
      <v-switch
        v-model="terms"
        :color="getColors.primary"
        label="Veuillez accepter les conditions générales d'utilisations."
      />
    </div>
    <div class="d-flex justify-content-center mt-8">
      <CommonsButton
        class="mr-2"
        :content="{ title: 'Retour', bgColor: 'white', textColor: 'text-primary', }"
        @click.native="$emit('previous')"
      />
      <CommonsButton :content="{ title: 'Passer au règlement', bgColor: 'primary', textColor: 'text-white', disabled: !terms }" @click.native="validate" />
    </div>
    <modal class="z-index-full" name="reimbursement-modal" height="auto" :adaptive="true" :scrollable="true">
      <RenewElementModalReimbursement />
    </modal>
  </div>
</template>

<script>
import { forEach } from 'lodash'
import ColorsMixin from '@/mixins/ColorsMixin'
import ErrorMixin from '@/mixins/ErrorMixin'
import FormMixin from '@/mixins/FormMixin'

export default {
  mixins: [ErrorMixin, ColorsMixin, FormMixin],
  data () {
    return {

      terms: false,
      valid: false,
      form: {
        phoneNumber: null
      }
    }
  },
  mounted () {
    this.$modal.show('reimbursement-modal')
  },
  methods: {
    findReasons (reasons) {
      let final = ''
      forEach(reasons, (x) => {
        const reason = this.getNationalityOptions.find((r) => {
          return r.value === x
        })
        if (reason) {
          final = `${final.length ? final : ''}${reason.text}. `
        }
      })
      return final
    },
    validate () {
      this.$emit('goToPayment')
    }
  }
}
</script>
