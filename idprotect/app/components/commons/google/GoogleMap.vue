<template>
  <div>
    <div class="text-center" v-if="messageError">
      <b-alert show variant="danger">
        <b-icon icon="exclamation-triangle" animation="throb" font-scale="3"></b-icon>
        <p>Impossible d'afficher la carte: {{ messageError }}</p>
      </b-alert>
    </div>
    <Positions
      :mapConfig="mapConfig"
      :apiKey="apiKey" 
      class="position-map"
      v-else
    >
      <template slot-scope="{ google, map }">
        <GoogleMapMarker
          v-for="marker in markers"
          :key="marker.id"
          :marker="marker"
          :google="google"
          :map="map"
        />
        <GoogleMapLine
          v-for="line in lines"
          :key="line.id"
          :path.sync="line.path"
          :google="google"
          :map="map"
        />
      </template>
    </Positions>
  </div>
</template>

<script>
import Positions from "~/components/commons/google/Positions"
import GoogleMapMarker from "~/components/commons/google/GoogleMapMarker"
import GoogleMapLine from "~/components/commons/google/GoogleMapLine"
import { mapSettings } from "~/components/commons/google/constants/mapSettings"
import { getAllPositions } from "~/api/position"
import mixinUser from "~/mixins/mixinUser"
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";

export default {
  name: "GoogleMap",
  mixins: [mixinUser, mixinMessages],
  components: {
    Positions,
    GoogleMapMarker,
    GoogleMapLine
  },
  data() {
    return {
      apiKey: process.env.API_KEY,
      messageError: null,
      markers: [
        // {
        //   id: "a",
        //   position: { lat: 48.866667, lng: 2.333333 },
        //   title: "Hello a!"
        // },
        // {
        //   id: "b",
        //   position: { lat: 45.5662672, lng: 5.9203636 },
        //   title: "Hello b!"
        // },
        // {
        //   id: "c",
        //   position: { lat: 47.2186371, lng: -1.5541362 },
        //   title: "Hello c!"
        // }
      ],
      lines: [],
    };
  },
  mounted() {
    this.checkUser().then((result) => {
        if(!result)
          this.logout()
    })
  },
  computed: {
    mapConfig() {
      this.getPositions()
      return { ...mapSettings, center: this.mapCenter }
    },
    mapCenter() {
      // Centrer la carte par défaut sur Paris
      return { lat: 48.866667, lng: 2.333333 }
    },
  },
  methods:{
    async getPositions() {
      try {
        let response = await getAllPositions(this.$store.state.authentication.type)
        if(response.status === 401)
          this.logout()
          
        let json = await response.json()

        if (json.error) {
          throw new Error(json.error)
        }
        
        const positions = json.positions
        for (let i = 0; i < positions.length; i++) {
          let value = {
            id: positions[i].id,
            title: positions[i].from,
            // icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            position: {
              lat: parseFloat(positions[i].latitude),
              lng: parseFloat(positions[i].longitude)
            }
          }

          this.markers.push(value)
        }

      } catch (e) {
        this.messageError = e.message
      }
    },
  }
};
</script>

<style scoped>
.position-map {
  height: 400px;
}
</style>
