<template>
  <div class="AccountPaymentConfirmation">
    <div class="bg-success rounded-lg py-8 py-lg-16 px-4 text-center">
      <div class="text-white">
        <h1 class="font-weight-bold">
          {{ $t('declare.confirmation.title') }}
        </h1>
        <p class="mx-auto mb-4" style="max-width: 500px;">
          {{ $t('declare.confirmation.description') }}
        </p>
      </div>
      <CommonsButton
        :content="$t('declare.confirmation.button')"
      />
    </div>
  </div>
</template>
