<template>
  <div>
    <div class="label text-left"> {{ this.label }} :</div>
    <div class="input-wrapper validate-input">
      <input :type="this.type"
             :name="this.name"
             :placeholder="this.placeholder"
             :aria-label="this.label"
             v-focus="this.autofocus"
             :value="value"
             @input="onInputChange"
      >

      <span class="top-right-focus" ref="topfocus"></span>
      <span class="bottom-left-focus" ref="bottomfocus"></span>
    </div>

    <SlideUpDown :active="showError" v-if="possibleErrors.length > 0">
      <div :class="['error', valid ? 'valid' : '']">
        <ul>
          <li v-for="(possibleError, index) in possibleErrors">
            <img v-if="errors[index]" src="../../../assets/times.svg" alt="error">
            <img v-else src="../../../assets/check.svg" alt="success">
            <span>{{ possibleError.description }}</span>
          </li>
        </ul>
      </div>
    </SlideUpDown>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue'

  declare module 'vue-slide-up-down' {

  }
  import SlideUpDown from 'vue-slide-up-down'

  const CustomInput = Vue.extend({
    name: 'CustomInput',
    props: {
      type: { type: String, required: true },
      name: { type: String, required: true },
      placeholder: { type: String, required: false, default: '' },
      label: { type: String, required: true },
      initialValue: { type: String, required: false, default: '' },
      autofocus: { type: Boolean, required: false, default: false },
      eventBus: {type: Object, required: false, default: null},
      possibleErrors: {
        type: Array as () => PossibleError[],
        required: false,
        default: () => ([]),
        validator: (possibleErrors) => {
          for (const possibleError of possibleErrors) {
            if (!possibleError.validator) {
              console.error('One or more possible errors on input do not have a validator.')
              return false
            }
          }
          return true
        },
      },
      errors: {
        type: Array,
        required: false,
        default: () => ([]),
      },
    },

    components: {
      SlideUpDown,
    },

    data () {
      return {
        showError: false,
        value: this.$props.initialValue,
      }
    },
    computed: {
      valid () {
        return !this.$props.errors.includes(true)
      },
    },
    methods: {
      onInputChange (element): void {
        this.$data.showError = true

        const input = element.target

        this.$data.value = input.value
        this.$emit('input', this.$props.name, input.value)
      },
    },

    model: {
      prop: 'initialValue',
      event: 'input',
    },

    directives: {
      focus: {
        inserted: function (el, binding) {
          if (binding.value === true) {
            el.focus()
          }
        },
      },
    },

    beforeMount (): void {
      if (this.$props.eventBus) {
        this.$props.eventBus.$on('showAllErrors', () => {this.$data.showError = true})
      }
    }
  })

  export default CustomInput
</script>

<style scoped lang="scss">
  .label {
    padding-bottom: 5px;
  }

  .input-wrapper {
    width: 100%;
    position: relative;
    background-color: #fff;
    border: 1px solid #e6e6e6;
  }

  input {
    outline: none;
    border: none;

    width: 100%;
    background: transparent;
    font-size: 15px;
    color: #666666;
    line-height: 1.2;
    height: 68px;
    padding: 0 25px 0 25px;

    &:focus + .top-right-focus {
      &::before {
        animation: full-w 0.2s linear 0s;
        animation-fill-mode: both;
      }

      &::after {
        animation: full-h 0.1s linear 0.2s;
        animation-fill-mode: both;
      }

      & + .bottom-left-focus::before {
        animation: full-w 0.2s linear 0.3s;
        animation-fill-mode: both;
      }

      & + .bottom-left-focus::after {
        animation: full-h 0.1s linear 0.5s;
        animation-fill-mode: both;
      }
    }

  }

  .top-right-focus,
  .bottom-left-focus {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;

    &::before {
      content: "";
      display: block;
      position: absolute;
      width: 0;
      height: 1px;
      background-color: #4272d7;
    }

    &::after {
      content: "";
      display: block;
      position: absolute;
      width: 1px;
      height: 0;
      background-color: #4272d7;
    }
  }

  .top-right-focus {
    &::before {
      top: -1px;
      left: 0;
    }

    &::after {
      top: 0;
      right: -1px;
    }
  }

  .bottom-left-focus {
    &::before {
      bottom: -1px;
      right: 0;
    }

    &::after {
      bottom: 0;
      left: -1px;
    }
  }

  @keyframes full-w {
    to {
      width: calc(100% + 1px);
    }
  }

  @keyframes full-h {
    to {
      height: calc(100% + 1px);
    }
  }

  .error {
    background-color: pink;
    border-radius: 0 0 5px 5px;

    margin-bottom: 5px;

    & > ul {
      padding-bottom: 5px;
      list-style: none;

      & img {
        height: 12px;
        width: 12px;
      }
    }

    &.valid {
      background-color: lightgreen;
    }
  }

  .list-enter,
  .list-leave-to {
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 10s;
  }
</style>
