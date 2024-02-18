<script>
import { POINT_MARKER_ICON_CONFIG } from "~/components/commons/google/constants/mapSettings";

export default {
  name: "GoogleMapMarker",
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },

  mounted() {
    const { Marker } = this.google.maps;

    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      title: this.marker.title,
      icon: POINT_MARKER_ICON_CONFIG
    });
  },

  render() {}
};
</script>

