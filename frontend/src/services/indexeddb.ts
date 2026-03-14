class IndexedDBService {
  private dbName: string
  private dbVersion: number
  private db: IDBDatabase | null = null

  constructor(dbName = 'FlashcardDB', dbVersion = 1) {
    this.dbName = dbName
    this.dbVersion = dbVersion
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = (event) => {
        reject(event)
      }

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // 创建闪卡存储
        if (!db.objectStoreNames.contains('flashcards')) {
          const flashcardStore = db.createObjectStore('flashcards', { keyPath: 'id' })
          flashcardStore.createIndex('category', 'category', { unique: false })
          flashcardStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // 创建工作记录存储
        if (!db.objectStoreNames.contains('worklogs')) {
          const worklogStore = db.createObjectStore('worklogs', { keyPath: 'id' })
          worklogStore.createIndex('category', 'category', { unique: false })
          worklogStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // 创建计划存储
        if (!db.objectStoreNames.contains('plans')) {
          const planStore = db.createObjectStore('plans', { keyPath: 'id' })
          planStore.createIndex('status', 'status', { unique: false })
          planStore.createIndex('priority', 'priority', { unique: false })
          planStore.createIndex('dueDate', 'dueDate', { unique: false })
        }
      }
    })
  }

  async get(storeName: string, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result)
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  async getAll(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result)
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  async add(storeName: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result as string)
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  async update(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(data)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = (event) => {
        reject(event)
      }
    })
  }
}

export const indexedDBService = new IndexedDBService()