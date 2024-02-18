export default function ({ store, redirect }): void {
  const { type } = store.state.authentication
  if (type !== null) {
    redirect('/')
  }
}
