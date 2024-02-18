<template>
  <div class="Presentation overflow-hidden">
    <div class="container-fluid d-flex align-items-stretch p-0" :class="screen? 'h-screen' : ''">
      <div class="row" :class="reverse? 'flex-row-reverse': ''">
        <div class="col-md-5 col-lg-5 d-flex align-items-center overflow-hidden p-8 py-lg-16 p-lg-8" :style="{ backgroundImage: 'url(' + resolveBackground(content.col1.background) + ')', backgroundSize: 'cover'}">
          <CommonsComposition :bigger="true" :content="content.col1" />
        </div>
        <div class="col-md-7 col-lg-7 p-0" :data-aos="animationClass" data-aos-duration="1200">
          <div class="d-flex flex-column h-100">
            <div v-for="col, colIndex in content.col2" :key="colIndex" class="d-flex flex-grow-1 align-items-center p-8 p-lg-16" :class="col.background">
              <CommonsComposition :content="col" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bg1 from '@/assets/images/bgs/bg_home1.jpg'
import bgDemandes from '@/assets/images/bgs/bg_demandes.jpg'
export default {
  props: {
    animationClass: {
      default: '',
      type: String
    },
    content: {
      default: () => {},
      type: Object
    },
    reverse: {
      default: false,
      type: Boolean
    },
    screen: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      bg1,
      bgDemandes
    }
  },
  methods: {
    resolveBackground (name) {
      switch (name) {
        case 'bg1':
          return bg1
        case 'bg_demandes':
          return bgDemandes
        default:
          return ''
      }
    }
  }
}
</script>
