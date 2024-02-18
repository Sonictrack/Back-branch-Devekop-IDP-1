<template>
  <b-alert variant="danger" show v-if="!isFormValid" class="mt-3">
    <u>Veuillez renseigner les points suivants:</u>
    <ul>
      <li v-for="alertField in alertFields" :key="alertField">
        {{ alertField }}
      </li>
    </ul>
  </b-alert>
</template>

<script>
export default {
  name: "ErrorFields",
  props:["isFormValid", "alertFields"]
}
</script>
