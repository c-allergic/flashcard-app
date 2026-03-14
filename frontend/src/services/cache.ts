class CacheService {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  set(key: string, data: any, ttl: number = 300000) { // 默认5分钟缓存
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)

    if (!cached) {
      return null
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  // 缓存API请求
  async cacheApiRequest(key: string, apiCall: () => Promise<any>, ttl: number = 300000): Promise<any> {
    const cached = this.get(key)

    if (cached) {
      return cached
    }

    const data = await apiCall()
    this.set(key, data, ttl)
    return data
  }
}

export const cacheService = new CacheService()