// src/utils/request.ts
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { useUserStore } from '~/stores/user'
import { getToken, getTokenHead } from '~/utils/auth'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  loading?: boolean
  isRepeatRequest?: boolean
  isResetEmptyParams?: boolean
  isHandleResponse?: boolean
}

const loadingInstanceMap = new Map<string, ReturnType<typeof ElLoading.service>>()
let requestCount = 0

function showLoading(key: string) {
  if (requestCount === 0) {
    const target = document.querySelector('#app') as HTMLElement
    loadingInstanceMap.set(
      key,
      ElLoading.service({ lock: true, text: '加载中...', target, fullscreen: false })
    )
  }
  requestCount++
}

function hideLoading(key: string) {
  requestCount--
  if (requestCount <= 0) {
    requestCount = 0
    const instance = loadingInstanceMap.get(key)
    instance?.close()
    loadingInstanceMap.delete(key)
  }
}

const pendingMap = new Map<string, AbortController>()

function getRequestKey(config: AxiosRequestConfig): string {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}

function createService(): AxiosInstance {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json'
    },
    validateStatus: (status) => status < 500
  })

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig & CustomAxiosRequestConfig) => {
      const requestKey = getRequestKey(config)

      if (config.isRepeatRequest) {
        if (pendingMap.has(requestKey)) {
          const controller = pendingMap.get(requestKey)!
          controller.abort()
          pendingMap.delete(requestKey)
        }

        const controller = new AbortController()
        config.signal = controller.signal
        pendingMap.set(requestKey, controller)
      }

      if (config.loading) {
        showLoading(requestKey)
      }

      const store = useUserStore()
      const token = getToken()
      const tokenHead = getTokenHead()
      if (token && !store.notTokenApis.includes(config.url!)) {
        config.headers.Authorization = `${tokenHead}${token}`
      }

      if (config.isResetEmptyParams) {
        const method = config.method?.toLowerCase()
        const dataKey = ['post', 'put'].includes(method!) ? 'data' : 'params'
        const paramsObj = config[dataKey as keyof typeof config]
        if (paramsObj && typeof paramsObj === 'object') {
          Object.keys(paramsObj).forEach((k) => {
            if (paramsObj[k] === '') paramsObj[k] = null
          })
        }
      }

      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestKey = getRequestKey(response.config)
      hideLoading(requestKey)
      pendingMap.delete(requestKey)

      const res = response.data

      if (response.config.responseType === 'blob') {
        if (!(res instanceof Blob)) {
          ElMessage.error('导出文件失败')
          return Promise.reject(new Error('Blob 数据异常'))
        }
        return res
      }

      if (res.code === 200) {
        return res
      }

      if ([401, 402, 99199].includes(res.code)) {
        ElMessage.error(res.message || '认证失败，请重新登录')
        useUserStore().logout()
        return Promise.reject(res)
      }

      if (!((response.config as CustomAxiosRequestConfig).isHandleResponse)) {
        ElMessage.error(res.message || '请求失败')
      }

      return Promise.reject(res)
    },
    (error) => {
      if (axios.isCancel(error)) {
        return Promise.reject(new Error('请求取消'))
      }

      ElMessage.error(
        error?.response?.data?.message || error.message || '请求异常，请稍后再试'
      )

      return Promise.reject(error)
    }
  )

  return instance
}

const service = createService()

export const http = {
  service,
  GET<T = any>(url: string, params?: any, config?: CustomAxiosRequestConfig) {
    return service.get<T>(url, { params, ...config })
  },
  POST<T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) {
    return service.post<T>(url, data, config)
  },
  PUT<T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) {
    return service.put<T>(url, data, config)
  },
  DEL<T = any>(url: string, params?: any, config?: CustomAxiosRequestConfig) {
    return service.delete<T>(url, { params, ...config })
  },
  PATCH<T = any>(url: string, data?: any, config?: CustomAxiosRequestConfig) {
    return service.patch<T>(url, data, config)
  },
  GET_EXPORT(url: string, params?: any) {
    return service.get(url, {
      params,
      responseType: 'blob',
      timeout: 1000 * 60 * 3
    })
  },
  POST_EXPORT(url: string, data?: any) {
    return service.post(url, data, {
      responseType: 'blob',
      timeout: 1000 * 60 * 3
    })
  },
  POST_FILE(url: string, formData: FormData) {
    return service.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
