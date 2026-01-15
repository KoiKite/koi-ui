import axios, { AxiosAdapter, AxiosPromise, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * 扩展 InternalAxiosRequestConfig 以支持 throttle 配置
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  throttle?: boolean;
}

/**
 * 缓存项接口
 */
interface CacheItem {
  /** 缓存时间戳 */
  timestamp: number;
  /** 缓存的 Promise 对象 */
  promise: AxiosPromise;
  /** 请求计数器，用于跟踪有多少个相同请求在等待 */
  pendingCount: number;
}

/**
 * 请求缓存映射
 */
interface RequestCache {
  [key: string]: CacheItem;
}

/**
 * 节流适配器配置选项
 */
export interface ThrottleAdapterOptions {
  /** 节流阈值（毫秒），默认 1000ms */
  threshold?: number;
  /** 需要节流的 HTTP 方法列表，默认 ['get', 'post', 'put', 'patch'] */
  methods?: string[];
  /** 需要排除节流的 URL 模式（支持正则表达式字符串或函数） */
  excludeUrls?: Array<string | RegExp | ((url: string) => boolean)>;
  /** 需要排除节流的请求方法列表 */
  excludeMethods?: string[];
  /** 缓存清理间隔（毫秒），默认 30000ms */
  cleanupInterval?: number;
  /** 是否在请求失败后立即清理缓存，默认 true */
  clearOnError?: boolean;
  /** 是否显示"点击过于频繁"提示，默认 true */
  showThrottleTip?: boolean;
  /** 需要显示提示的 HTTP 方法列表，默认与 methods 相同，可单独配置 */
  tipMethods?: string[];
  /** 提示消息内容，默认 "操作过于频繁，请稍后再试" */
  throttleTipMessage?: string;
  /** 提示回调函数，如果提供则使用自定义提示方式，否则使用默认提示 */
  onThrottle?: (message: string, config: ExtendedAxiosRequestConfig) => void;
  /** 提示防抖间隔（毫秒），同一请求的提示间隔，默认 2000ms */
  tipThrottleInterval?: number;
}

/**
 * 序列化请求数据，支持多种数据格式
 */
const serializeData = (data: any): string => {
  if (data === null || data === undefined) {
    return '';
  }

  // FormData 对象
  if (data instanceof FormData) {
    // FormData 无法直接序列化，使用 URL 和类型标识
    return `[FormData:${data.constructor.name}]`;
  }

  // URLSearchParams 对象
  if (data instanceof URLSearchParams) {
    return data.toString();
  }

  // ArrayBuffer、Blob 等二进制数据
  if (data instanceof ArrayBuffer) {
    return `[ArrayBuffer:${data.byteLength}]`;
  }
  
  if (data instanceof Blob) {
    return `[Blob:${data.size}]`;
  }

  // 普通对象或数组
  if (typeof data === 'object') {
    try {
      // 对对象进行排序以确保一致性
      return JSON.stringify(data, Object.keys(data).sort());
    } catch (error) {
      // 如果序列化失败，使用字符串表示
      return String(data);
    }
  }

  return String(data);
};

/**
 * 生成缓存键
 * 通过请求方法、URL、参数和请求体生成唯一的缓存标识
 */
const generateCacheKey = (config: AxiosRequestConfig | InternalAxiosRequestConfig): string => {
  const method = (config.method || 'get').toLowerCase();
  const url = String(config.url || '');
  const baseURL = String(config.baseURL || '');
  
  // 处理查询参数
  let paramsStr = '';
  if (config.params) {
    if (config.params instanceof URLSearchParams) {
      paramsStr = config.params.toString();
    } else {
      paramsStr = serializeData(config.params);
    }
  }

  // 处理请求体
  const dataStr = serializeData(config.data);

  // 组合生成唯一键
  return `${method}:${baseURL}${url}:${paramsStr}:${dataStr}`;
};

/**
 * 检查 URL 是否应该被排除
 */
const shouldExcludeUrl = (
  url: string,
  excludeUrls?: Array<string | RegExp | ((url: string) => boolean)>
): boolean => {
  if (!excludeUrls || excludeUrls.length === 0) {
    return false;
  }

  return excludeUrls.some(pattern => {
    if (typeof pattern === 'string') {
      return url.includes(pattern);
    }
    if (pattern instanceof RegExp) {
      return pattern.test(url);
    }
    if (typeof pattern === 'function') {
      return pattern(url);
    }
    return false;
  });
};

/**
 * 获取默认的 axios 适配器
 */
const getDefaultAdapter = (): AxiosAdapter => {
  // 优先使用 axios.defaults.adapter
  if (axios.defaults.adapter && typeof axios.defaults.adapter === 'function') {
    return axios.defaults.adapter;
  }
  
  // 如果不存在，创建一个临时 axios 实例来获取其默认适配器
  // 这样可以确保获取到正确的适配器（浏览器环境使用 xhr，Node.js 使用 http）
  const tempInstance = axios.create();
  const tempAdapter = tempInstance.defaults.adapter;
  
  if (tempAdapter && typeof tempAdapter === 'function') {
    return tempAdapter;
  }
  
  // 最后的回退：尝试使用 axios 的内部适配器获取方法
  // 注意：这依赖于 axios 的内部实现，可能在不同版本中有所不同
  try {
    // @ts-ignore - axios 内部方法，可能不存在
    if (axios.getAdapter && typeof axios.getAdapter === 'function') {
      // @ts-ignore
      const adapter = axios.getAdapter(['xhr', 'http']);
      if (adapter && typeof adapter === 'function') {
        return adapter;
      }
    }
  } catch (e) {
    // 忽略错误，继续尝试其他方法
  }
  
  // 如果仍然无法获取，抛出错误
  throw new Error('[ThrottleAdapter] 无法获取有效的 axios 适配器，请确保已正确导入 axios 并初始化');
};

/**
 * 创建节流适配器
 * 
 * @param adapter - 原始 axios 适配器，如果不提供则自动获取默认适配器
 * @param options - 节流配置选项
 * @returns 配置了节流功能的适配器函数
 * 
 * @example
 * const adapter = createThrottleAdapter(undefined, {
 *   threshold: 2000,
 *   methods: ['get', 'post'],
 *   excludeUrls: ['/api/upload', /^\/api\/export/]
 * });
 * axiosInstance.defaults.adapter = adapter;
 */
export const createThrottleAdapter = (
  adapter?: AxiosAdapter,
  options: ThrottleAdapterOptions | number = {}
): AxiosAdapter => {
  // 如果没有提供 adapter，则获取默认适配器
  const actualAdapter: AxiosAdapter = adapter || getDefaultAdapter();
  
  // 验证 adapter 是否为函数
  if (typeof actualAdapter !== 'function') {
    throw new TypeError('[ThrottleAdapter] adapter 必须是一个函数');
  }
  
  // 兼容旧版本：如果第二个参数是数字，则作为 threshold
  const opts: ThrottleAdapterOptions = typeof options === 'number'
    ? { threshold: options }
    : options;

  const {
    threshold = 1000,
    methods = ['get', 'post', 'put', 'patch'],
    excludeUrls = [],
    excludeMethods = ['options', 'head'],
    cleanupInterval = 30000,
    clearOnError = true,
    showThrottleTip = true,
    tipMethods = ['post', 'put'], // 如果未指定，则使用 methods
    throttleTipMessage = '操作过于频繁，请稍后再试',
    onThrottle,
    tipThrottleInterval = 2000
  } = opts;
  
  // 如果未指定 tipMethods，则使用 methods
  const actualTipMethods = tipMethods || methods;

  const cache: RequestCache = {};
  let lastCleanup = Date.now();
  
  // 提示防抖记录：记录每个请求的最后提示时间
  const tipTimestamps: { [key: string]: number } = {};
  
  /**
   * 显示节流提示
   */
  const showTip = (config: ExtendedAxiosRequestConfig, cacheKey: string): void => {
    if (!showThrottleTip) {
      return;
    }
    
    // 检查请求方法是否在提示方法列表中
    const method = (config.method || 'get').toLowerCase();
    if (!actualTipMethods.includes(method)) {
      return;
    }
    
    const now = Date.now();
    const lastTipTime = tipTimestamps[cacheKey] || 0;
    
    // 防抖：同一请求的提示间隔
    if (now - lastTipTime < tipThrottleInterval) {
      return;
    }
    
    // 更新提示时间
    tipTimestamps[cacheKey] = now;
    
    // 使用自定义回调或默认提示
    if (onThrottle && typeof onThrottle === 'function') {
      try {
        onThrottle(throttleTipMessage, config);
      } catch (error) {
        console.warn('[ThrottleAdapter] 提示回调函数执行失败:', error);
      }
    } else {
      // 默认提示：尝试动态导入提示函数，如果失败则使用 console.warn
      try {
        // 动态导入提示函数（避免循环依赖）
        import('@/utils/koi').then(({ koiMsgWarning }) => {
          koiMsgWarning(throttleTipMessage, false, 2000);
        }).catch(() => {
          // 如果导入失败，使用 console.warn
          console.warn(`[ThrottleAdapter] ${throttleTipMessage}`);
        });
      } catch (error) {
        console.warn(`[ThrottleAdapter] ${throttleTipMessage}`);
      }
    }
  };

  /**
   * 清理过期缓存
   */
  const cleanupExpiredCache = (): void => {
    const now = Date.now();

    // 检查是否需要执行清理
    if (now - lastCleanup < cleanupInterval) {
      return;
    }

    lastCleanup = now;
    const expiredKeys: string[] = [];

    // 找出所有过期的缓存键
    Object.keys(cache).forEach(key => {
      const item = cache[key];
      if (item && now - item.timestamp > threshold) {
        expiredKeys.push(key);
      }
    });

    // 删除过期缓存
    expiredKeys.forEach(key => {
      delete cache[key];
    });
  };

  return (config: ExtendedAxiosRequestConfig): AxiosPromise => {
    const method = (config.method || 'get').toLowerCase();
    const url = String(config.url || '');

    // 检查是否应该禁用节流
    // 1. 配置中明确禁用
    if (config.throttle === false) {
      return actualAdapter(config);
    }

    // 2. 方法不在节流列表中
    if (!methods.includes(method)) {
      return actualAdapter(config);
    }

    // 3. 方法在排除列表中
    if (excludeMethods.includes(method)) {
      return actualAdapter(config);
    }

    // 4. URL 在排除列表中
    if (shouldExcludeUrl(url, excludeUrls)) {
      return actualAdapter(config);
    }

    // 生成缓存键
    const cacheKey = generateCacheKey(config);
    const now = Date.now();

    // 定期清理过期缓存
    cleanupExpiredCache();

    // 检查是否存在有效缓存
    const cached = cache[cacheKey];
    if (cached && now - cached.timestamp <= threshold) {
      // 增加等待计数
      cached.pendingCount++;
      
      // 显示节流提示（防抖机制在 showTip 内部处理）
      showTip(config, cacheKey);
      
      // 返回缓存的 Promise
      // 注意：这里直接返回原 Promise，多个调用者会共享同一个 Promise
      // 这是期望的行为，因为我们要合并相同的请求
      return cached.promise;
    }

    // 发起新请求
    const promise = actualAdapter(config);

    // 缓存新请求
    cache[cacheKey] = {
      timestamp: now,
      promise,
      pendingCount: 1
    };

    // 请求完成后的处理
    promise
      .then((response) => {
        const item = cache[cacheKey];
        
        // 验证这是当前缓存的请求（防止缓存被覆盖）
        if (item && item.promise === promise) {
          // 如果请求耗时超过阈值，立即清理缓存
          // 这样可以避免长时间请求占用缓存空间
          if (Date.now() - item.timestamp > threshold) {
            delete cache[cacheKey];
          }
        }
        
        return response;
      })
      .catch((error) => {
        const item = cache[cacheKey];
        
        // 请求失败时的处理
        if (item && item.promise === promise) {
          if (clearOnError) {
            // 立即清理缓存，允许重试
            delete cache[cacheKey];
          } else {
            // 延迟清理，但标记为失败状态
            // 可以根据需要扩展 CacheItem 来存储错误状态
            setTimeout(() => {
              if (cache[cacheKey]?.promise === promise) {
                delete cache[cacheKey];
              }
            }, threshold);
          }
        }
        
        return Promise.reject(error);
      });

    return promise;
  };
};

/**
 * 快捷方法：在现有 axios 实例上应用节流适配器
 * 
 * @param instance - axios 实例
 * @param options - 节流配置选项（可以是数字作为 threshold，或配置对象）
 * 
 * @example
 * ```typescript
 * import axiosInstance from '@/utils/axios-normal';
 * import { applyThrottleAdapter } from '@/utils/throttleAdapter';
 * 
 * // 使用默认配置
 * applyThrottleAdapter(axiosInstance);
 * 
 * // 使用自定义配置
 * applyThrottleAdapter(axiosInstance, {
 *   threshold: 2000,
 *   methods: ['get', 'post']
 * });
 * 
 * // 兼容旧版本：直接传入数字
 * applyThrottleAdapter(axiosInstance, 1500);
 * ```
 */
export const applyThrottleAdapter = (
  instance: any,
  options?: ThrottleAdapterOptions | number
): void => {
  if (!instance || !instance.defaults) {
    console.warn('[ThrottleAdapter] 无效的 axios 实例');
    return;
  }

  // 保存原始适配器
  const originalAdapter = instance.defaults.adapter || axios.defaults.adapter;
  
  // 应用节流适配器
  instance.defaults.adapter = createThrottleAdapter(originalAdapter, options);
};