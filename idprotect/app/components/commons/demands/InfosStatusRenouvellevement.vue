<template>
    <div>
        <div class="text-center mt-1">
            <b-button v-b-toggle.status-info class="m-1"
            ><b-icon icon="info-circle-fill" variant="light"></b-icon> A propos
            des statuts!</b-button>
        </div>
        <b-sidebar id="status-info" title="Remarques" right shadow backdrop-variant="dark" backdrop>
        <div class="px-3 py-2">
            <ul>
            <li>
                <b-badge variant="secondary">En cours</b-badge> : Vous venez
                d'effectuer votre demande.
            </li>
            <li>
                <b-badge variant="danger">Annulée</b-badge> : Votre demande a été
                annulée à votre demande ou celle d'ID Protect.
            </li>
            <li>
                <b-badge variant="success">Validée</b-badge> : votre demande a été
                validée et votre document est prêt.
            </li>
            <li>
                <b-badge variant="warning">En attente d'informations</b-badge> : des
                informations sont communiquées ou demandées par ID Protect.
            </li>
            </ul>
        </div>
        </b-sidebar>
    </div>
</template>

<script>
export default {
    name: 'InfosStatusRenouvellevement',
}
</script>