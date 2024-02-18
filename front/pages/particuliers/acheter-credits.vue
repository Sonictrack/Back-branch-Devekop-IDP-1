<template>
    <div id="professionals_area" class="blue-theme">
      <BuyVerifications />
    </div>
  </template>
  
  <script>
  import BuyVerifications from './../../components/verifications/BuyVerifications'
  
  export default {
    middleware: 'auth',
    components: { BuyVerifications }
  }
  </script>