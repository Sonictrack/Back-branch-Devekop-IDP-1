<template>
  <div class="pink-theme">
    <section class="section bg-white area-header">
        <div class="container-fluid">
            <div class="row justify-content-center align-items-center">
                <div class="col-lg-5">
                   <div class="text-center">
                       <h1 class="home-title mb-4">Bonjour, {{ this.getCurrentUser.firstname + ' ' + this.getCurrentUser.lastname }}</h1>
                       <h3 class="mb-3">Bienvenue dans votre espace membre</h3>
                   </div>
                </div>
            </div>
        </div>
    </section>
    <AccountFileCheck :is-module="false" />
  </div>
</template>

<script>
import UserMixin from '../../mixins/UserMixin'

export default {
  middleware: 'auth',
  mixins: [UserMixin]
}
</script>
