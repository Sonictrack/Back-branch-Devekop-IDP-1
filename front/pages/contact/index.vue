<template>
  <div class="Contact">
    <header class="bg-primary text-white py-16 text-center">
      <div class="container">
        <h2 class="font-weight-light mb-4" v-html="$t('contact.header.title')" />
        <h2>{{ $t('contact.header.description') }}</h2>
      </div>
    </header>
    <RequestOffer :content="$t('contact.content')" />
    <RequestSocial />
    <h2 class="container text-center text-primary font-weight-light my-8" v-html="$t('contact.note')" />
    <modal class="z-index-full" name="contact-modal" height="auto" :scrollable="true">
      <ContactForm />
    </modal>
  </div>
</template>
