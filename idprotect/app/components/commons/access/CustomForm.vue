<template>
  <div class="main-container">
    <div class="form-container" ref="formContainer">
      <form @submit.prevent="onSubmit">
        <h1> {{ title }} </h1>

        <ul class="globalErrors" v-if="this.$props.globalErrors">
          <li class="globalError" v-for="(error, index) in this.$props.globalErrors" :key="index">
            {{ error }}
          </li>
        </ul>

        
      </form>

      <div class="form-footer"
           v-if="this.$slots.default">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import CustomInput from '~/components/commons/access/CustomInput.vue'

  const CustomForm = Vue.extend({
    name: 'CustomForm',
    components: { CustomInput },
    props: {
      title: String,
      buttonLabel: String,
      globalErrors: {
        type: Array as () => string[],
        required: false,
        default: [],
      },
      buttonClasses: {
        type: Array as () => string[],
        required: false,
        default: [],
      },
      inputTypes: {
        type: Array as () => InputProps[],
        validator: (inputTypes) => {
          for (const inputType of inputTypes) {
            if (!inputType.possibleErrors) {
              return true
            }

            for (const possibleError of inputType.possibleErrors) {
              if (!possibleError.validator) {
                console.error('One or more possible errors on input "' + inputType.name + '" do not have a validator.')
                return false
              }
            }
          }
          return true
        },
      },
    },

    data () {
      return {
        inputs: this.inputTypes.map(input => ({ ...input, value: '', valid: false })) as FormInput[],
        eventBus: new Vue(),
      }
    },

    computed: {
      inputsObject (): { [name: string]: FormInput } {
        return this.$data.inputs.reduce((prev: any, curr: any) => {
          prev[curr.name] = curr
          return prev
        }, {})
      },
    },

    watch: {
      globalErrors: function (val: string[]): void {
        if (val.length > 0) {
          const formContainer = this.$refs.formContainer as HTMLDivElement
          setTimeout(() => formContainer.scroll({ behavior: 'smooth', top: 0 }), 1)
        }
      },
    },

    methods: {
      valid (): boolean {
        return !this.inputs.find(input => !input.valid)
      },

      onInput (name: string, value: any) {
        const inputs = this.inputsObject
        const input = inputs[name]
        input.value = value

        let valid = true

        if (input.possibleErrors) {
          for (const error of input.possibleErrors) {

            if (!error.validator(inputs)) {
              valid = false
              break
            }
          }
        }

        input.valid = valid
        this.$emit('input', { name, value })
      },

      getErrors (input: any) {
        return input.possibleErrors ? input.possibleErrors.map((error: any) => !error.validator(this.inputsObject)) : []
      },

      onSubmit () {
        this.$data.eventBus.$emit('showAllErrors')
        if (this.valid()) {
          this.$emit('submit', this.$data.inputs)
        }
      },
    },
  })

  export default CustomForm
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

  .globalErrors {

  }

  .globalError {
    color: red;
  }

  .form-footer {
    padding: 20px 55px 0;
  }

  .submit-button {
    transition: all 0.2s;
  }
</style>
