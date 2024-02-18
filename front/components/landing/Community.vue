<template>
  <div class="container-fluid">
    <div class="section row d-flex align-items-center h-screen text-left-lg py-8" :style="{'background-image': 'url(' + require('@/assets/images/bgs/bg_home3.jpg') + ')'}">
      <div class="col-md-3 d-flex align-items-center justify-content-center text-center">
        <img src="@/assets/images/logos/logo-orange.png" alt="ID Protect" width="200px">
      </div>
      <div class="col-md-9 text-orange font-weight-light" data-aos="slide-left" data-aos-duration="1200">
        <h4 class="mb-0">
          {{ $t('landing.community.title') }}
        </h4>
        <h4 class="mb-4">
          {{ $t('landing.community.description') }}
        </h4>
        <CommonsButton :content="{ bgColor: $t('landing.community.button.bgColor'), textColor: $t('landing.community.button.textColor'), title: $t('landing.community.button.title') }" />
      </div>
    </div>
  </div>
</template>
