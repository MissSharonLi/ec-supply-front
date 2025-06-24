import { POST } from '~/sdk/fetch'

export const login = (params: any) => POST('/ec-ums-api/user/login', params)
