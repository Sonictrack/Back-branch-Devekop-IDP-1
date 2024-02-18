const ColorsMixin = {
  computed: {
    getColors () {
      return { red: '#ff1111', success: '#01b301', secondary: '#BB298C', primary: '#3963AB', white: '#fff', orange: '#E9521D', orangeButton: '#ffa563' }
    },
    getColorType () {
      return this.pro ? this.getColors.secondary : this.getColors.primary
    },
    getClassColor () {
      if (this.color) {
        return this.getColors[this.color]
      }
      if (this.$route.path.includes('/professionnels')) {
        return 'secondary'
      }
      return 'primary'
    },
    getBackgroundColor () {
      return `bg-${this.getClassColor}`
    },
    getBorderColor () {
      return `border border-${this.getClassColor}`
    },
    getTextColor () {
      if (this.$route.path.includes('/professionnels')) {
        return 'text-secondary'
      }
      return `text-${this.getClassColor}`
    }
  },
  methods: {
    getStatusColor (status) {
      switch (status) {
        case 'EC':
          return 'primary'
        case 'ANN':
          return 'red'
        case 'VAL':
          return 'success'
        case 'INFO':
          return 'orangeButton'
        default:
          break
      }
    }
  }
}

export default ColorsMixin
