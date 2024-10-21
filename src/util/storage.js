/**
 * @class StorageClass 缓存类
 * @constructor storageType 构造函数传递系统缓存对象
 * @function save 储存缓存数据
 * @function get 获取缓存数据
 * @function remove 指定移除缓存数据
 * @function clear 清空所有缓存
 */
class StorageClass {
    storage
    isLocal

    constructor(storageType, isLocal) {
        this.storage = storageType
        this.isLocal = isLocal
    }

    /**
     * @param keyVal 需要保存的键值对数据
     * @param days 保存的时间 默认一天
     */
    save = (keyVal, days) => {
        /** 保存的天数 */
        let expireTime = days !== -1 ? days || 1 : 0

        /** local 默认无限期保存 */
        if (this.isLocal === 'local' && !days) expireTime = -100000

        Object.entries(keyVal).forEach((entries) => {
            /** 天数对应的时间戳值 */
            const cacheExpire = expireTime * 86400000 + new Date().getTime()

            /** 循环对象进行储存 */
            this.storage.setItem(
                entries[0],
                JSON.stringify({
                    exp: cacheExpire,
                    val: entries[1],
                }),
            )
        })
    }

    get = (key) => {
        /** 获取缓存的数据值 */
        const storageVal = this.storage.getItem(key)

        /** 判空处理 */
        if (!storageVal) {
            return null
        }

        const parseVal = JSON.parse(storageVal)

        /** 错误解析格式判断 */
        if (!parseVal) {
            return storageVal
        }

        const { exp, val } = parseVal
        const nowTime = new Date().getTime()

        /** 比较缓存时间是否过期 */
        if (exp > 0 && nowTime > exp) {
            this.remove(key)
            return null
        }

        return val
    }

    remove = (key) => {
        this.storage.removeItem(key)
    }

    clear = () => {
        this.storage.clear()
    }
}

/**
 * @class session session 缓存对象
 */
export const session = new StorageClass(window.sessionStorage)

/**
 * @class local 本地缓存对象
 */
export const local = new StorageClass(window.localStorage, 'local')
