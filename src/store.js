const K = { user: 'gs_user', result: 'gs_result' }

const get = (k, fallback) => {
  try { return JSON.parse(sessionStorage.getItem(k)) ?? fallback } catch { return fallback }
}
const set = (k, v) => sessionStorage.setItem(k, JSON.stringify(v))

export const store = {
  getUser:   ()  => get(K.user, null),
  setUser:   (u) => set(K.user, u),
  getResult: ()  => get(K.result, null),   // { first, second, third, scores }
  setResult: (r) => set(K.result, r),
  clear: () => Object.values(K).forEach(k => sessionStorage.removeItem(k)),
}
