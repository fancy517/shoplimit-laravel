export function agentRequireAuth(to, from, next) {
  if (localStorage.profileStatus === 'agent') next()
  else next(from)
}

export function clientRequireAuth(to, from, next) {
  if (localStorage.profileStatus === 'client') next()
  else next(from)
}
