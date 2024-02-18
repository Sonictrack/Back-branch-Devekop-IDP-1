import Vue from "vue";
import { sendNotifcation } from "~/api/notification";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { UserType } from "../components/enums/userType";
import { checkUserAllowed } from "~/api/user";

export default Vue.mixin({
  mixins: [mixinMessages],
  methods: {
    async checkUser(){
      return new Promise(async (resolve,reject)=>{
        const type = this.$store.state.authentication.type
        if(type === UserType.admin || type === UserType.individual || type === UserType.partner){
          const result = await checkUserAllowed(this.$store.state.authentication.type)
          const json = await result.json()
          if(!json.success)
            return resolve(false)
  
          return resolve(true)
        }
        return resolve(false)
      })
    },
    getNameFromClientNumber(client){
      if(client.clientNumber === UserType.individual){
        return `${client.firstname} ${client.lastname}`
      }
      return client.companyName
    },
    getDetailUser(user){
      if(user){
        if(user.type === UserType.partner)
          return `Société ${user.companyName.toUpperCase()}`
        else if(user.type === UserType.individual)
          return `${user.firstname.toUpperCase()} ${user.lastname}`
      }
      return '';
    },
    logout(): void {
      this.$store.dispatch('authentication/logout');
      this.$router.replace('/');
    },
    async sendNotification(action, to, detail) {
      try {
        
        const notification = {
          action,
          to,
          detail,
        };

        await sendNotifcation(this.$store.state.authentication.type, notification);
      } catch (e) {
        //@ts-ignore
        this.makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
  },

  computed: {
    isLoggedIn(): string {
      // @ts-ignore
      return this.$store.state.authentication.type !== null;
    },
    isPartner(){
      // @ts-ignore
      return this.$store.state.authentication.type === UserType.partner;
    },
    isParticulier(){
      // @ts-ignore
      return this.$store.state.authentication.type === UserType.individual;
    },
    isAdmin(){
      // @ts-ignore
      return this.$store.state.authentication.type === UserType.admin;
    }
  },
});
