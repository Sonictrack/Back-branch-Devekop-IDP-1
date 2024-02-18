<style scoped>
.Request {
  padding-top: 50px;
}

</style>

<template>
  <div class="Request">
    <LandingPresentation :content="$t('request.presentation')" animation-class="slide-left" />
    <RequestOffer :content="$t('request.renew')" />
    <RequestOffer :content="$t('request.prevention')" />
    <RequestOffer id="tarifs" :content="$t('request.prices')" />
  </div>
</template>
