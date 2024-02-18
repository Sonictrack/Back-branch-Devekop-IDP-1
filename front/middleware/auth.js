export default async ({ store, redirect, $api, route }) => {
  await $api.auth.authStateChange()
  const { user } = store.state.auth
  if (user === undefined) {
    redirect('/')
  }
  if (user && user.type === 'individual') {
    if (route.path.includes('professionnels')) {
      redirect('/particuliers/espace-client')
    }
  } else if (route.path.includes('particuliers')) {
    redirect('/professionnels/espace-client')
  }
}
