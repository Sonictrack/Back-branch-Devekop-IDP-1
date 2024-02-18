<style scoped>


@media screen and (min-width: 0px) and (max-width: 425px){
  .bg-primary {
  margin: 0;
  height: 120vh;
  padding-top: 135px;
}

}
@media screen and (min-width: 426px) and (max-width: 625px){
  .bg-primary {
  margin: 0;
  height: 130vh;
  padding-top: 105px;
}

}
@media screen and (min-width: 626px) and (max-width: 1400px){
  .bg-primary {
  margin: 0;
  height: 130vh;
  padding-top: 105px;
}

}

</style>

<template>
  <div class="bg-primary">
    <div class="container h-screen d-flex align-items-center py-lg-0 pb-16 pt-0 pt-24">
      <div class="row">
        <div class="col-lg-6 d-flex align-items-center">
          <img src="@/assets/images/logos/logo-white.png" alt="IDProtect" height="250" class="mx-auto">
        </div>
        <div class="col-lg-6 text-white text-left-lg">
          <h1 class="font-weight-bold">
            {{ $t('landing.header.title') }}
          </h1>
          <p class="text-32 font-weight-light">
            {{ $t('landing.header.subtitle') }}
          </p>
          <p>{{ $t('landing.header.description') }}</p>
          <div class="mt-8">
            <CommonsButton v-for="btn, btnIndex in $t('landing.header.buttons')" :key="btnIndex" class="m-2" :content="btn" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
