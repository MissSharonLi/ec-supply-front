export const getToken = () => localStorage.getItem('token') || ''
export const getTokenHead = () => 'Bearer '

export function setToken(token: string) {
    localStorage.setItem('token', token)
}

export function removeToken() {
    localStorage.removeItem('token')
}

export function clearToken() {
    localStorage.clear()
}

export function hasToken() {
    return !!getToken()
}
