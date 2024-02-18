import { UserType } from "../components/enums/userType";

export default function ({ store, redirect }): void {
  const { type } = store.state.authentication

  if (type === null) {
    if(type === UserType.partner){
      redirect('/partenaire/authentification')
    } else if (type === UserType.individual) {
      redirect('/particulier/authentification')      
    } else if(type === UserType.admin) {
      redirect('/admin/authentification')
    } else {
      redirect('/')
    }
  }
}



