<template>
  <div id="Home">
    <LandingHeader />
    <LandingPresentation :content="$t('landing.particulier')" animation-class="slide-left" />
    <LandingPresentation :content="$t('landing.professionnel')" :reverse="true" animation-class="slide-right" />
    <LandingCommunity />
  </div>
</template>
