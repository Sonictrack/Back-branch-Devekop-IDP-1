import { mapGetters } from 'vuex';
import AuthService from '../api/auth';

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      getCurrentUser: 'auth/getCurrentUser'
    }),
    isCurrentUserPro () {
      if (!this.getCurrentUser) { return false; }
      return this.getCurrentUser.type === 'partner';
    }
  },
  methods: {
    hideRealFilename (filename) {
      return filename.split('-uuid-')[1];
    },
    downloadDocument (item, src) {
      let path;
      if (src) {
        path = item[src];
      } else {
        path = item.path;
      }
      this.$api.documents.downloadFile(this.getCurrentUser.type, path, item.name);
    },
    async authStateChange() {
      const type = localStorage.getItem('type');
      if (type) {
        const authService = new AuthService(this);
        await authService.getUser(type);
      }
    }
  },
  async created() {
    await this.authStateChange();
  }
};
