<template>
    <div class="text-center mb-3" v-if="isBusy">
        <b-spinner style="width: 3rem; height: 3rem;" :variant="color" :label="spinMessage"></b-spinner>
      {{spinMessage}}
    </div>
</template>

<script>
export default {
    name: "SpinnerDataDownload",
    props: ["isBusy", "spinMessage", "color"]
}
</script>