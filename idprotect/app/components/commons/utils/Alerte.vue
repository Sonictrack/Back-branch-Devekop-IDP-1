<template>
    <div class="text-center">
        <b-alert show variant="success" v-if="messageSuccess">
            <b-icon icon="hand-thumbs-up" animation="fade" font-scale="2"></b-icon>
            <p>{{ messageSuccess }}</p>
        </b-alert>
        <b-alert show variant="danger" v-if="messageError">
            <b-icon icon="exclamation-triangle" animation="fade" font-scale="2"></b-icon>
            <p>{{ messageError }}</p>
        </b-alert>
    </div>
</template>

<script>
export default {
    name: "AlerteUtils",
    props: ["messageSuccess", "messageError"]
}
</script>
