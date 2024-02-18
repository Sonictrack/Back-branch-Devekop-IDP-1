<template>
  <div class="RenewModalReimbursement m-4 text-orange">
    <header class="container mb-4">
      <h1 class="text-32 font-weight-light mb-4">
        Le saviez-vous ?
      </h1>
      <p class="font-weight-light">
        Vous pouvez être remboursé !
      </p>
      <p class="font-weight-bold mb-1">
        En cas de perte ou de vol, vous bénéficiez peut-être d’une assurance grâce à votre carte bleue VISA vous permettant de rembourser votre timbre fiscal !<br><br>Nos experts vous contacterons pour vous accompagner dans votre démarche.
      </p>
    </header>
    <div class="d-flex align-items-center justify-content-center mt-4">
      <CommonsButton :content="{title: 'J\'ai compris' }" class="mr-2" @click.native="$modal.hide('reimbursement-modal')" />
    </div>
  </div>
</template>
