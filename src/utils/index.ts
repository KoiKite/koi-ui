/**
 * @description 生成唯一 uuid
 * @returns {String}
 */
export function generateUUID() {
  let uuid = "";
  for (let i = 0; i < 32; i++) {
    let random = (Math.random() * 16) | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) uuid += "-";
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

/**
 * 路径匹配器
 * @param {string} pattern
 * @param {string} path
 * @returns {Boolean}
 */
export function isPathMatch(pattern: string, path: string) {
  const regexPattern = pattern
    .replace(/\//g, '\\/')
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^\\/]*')
    .replace(/__DOUBLE_STAR__/g, '.*');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any, id?: any, parentId?: any, children?: any) {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  var childrenListMap: any = {};
  var nodeIds: any = {};
  var tree: any = [];

  for (let d of data) {
    let parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (let d of data) {
    let parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (let t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o: any) {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (let c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }

  return tree;
}

/**
 * 将扁平列表转换为树形结构
 * @param {Array} data 数据数组
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @returns {Array} 树形结构数据
 */
export function handleToTree(data: any, id?: any, parentId?: any, children?: any) {
  let config = {
    id: id || "id",
    parentId: parentId || "parentId",
    childrenList: children || "children"
  };

  const map = new Map();
  const tree: any = [];

  // 将所有项存入map，并初始化children数组
  data.forEach((item: any) => {
    const node = { ...item };
    node[config.childrenList] = [];
    // 使用String()确保key的类型一致性，避免数字和字符串不匹配的问题
    map.set(String(node[config.id]), node);
  });

  // 构建树形结构
  data.forEach((item: any) => {
    const node = map.get(String(item[config.id]));
    const pId = String(item[config.parentId]);

    // 注意：这里将parentId转换为字符串进行比较
    if (pId !== "null" && pId !== "undefined" && map.has(pId)) {
      map.get(pId)[config.childrenList].push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}

/**
 * 把日期范围构造成 beginTime AND endTime
 * @param params 传递对象参数
 * @param dateRange 日期数组
 * @param propName1 自定义名称1
 * @param propName1 自定义名称2
 * @returns
 */
export function koiDatePicker(searchParams: object, dateRange: any, propName1?: string, propName2?: string) {
  searchParams = typeof searchParams === "object" && searchParams !== null && !Array.isArray(searchParams) ? searchParams : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (propName1 != null && propName1 != "" && propName2 != null && propName2 != "") {
    // 创建一个空的对象
    const dataParams: any = {};
    dataParams[propName1] = dateRange[0];
    dataParams[propName2] = dateRange[1];
    return Object.assign({}, searchParams, dataParams);
  } else {
    const dataParams = {
      beginTime: dateRange[0],
      endTime: dateRange[1]
    };
    return Object.assign({}, searchParams, dataParams);
  }
}

/**
 * 回显数据字典，进行状态翻译(数组对象)
 * @param dataList 当前状态数据列表
 * @param value 需要进行翻译的值
 * @returns
 */
export function selectDictLabel(dataList: any, value: any) {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  var actions = [];
  Object.keys(dataList).map(key => {
    // 循环数据的获取key
    if (dataList[key].dictValue === "" + value) {
      actions.push(dataList[key].dictLabel);
      return true;
    }
  });
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join("");
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单动态数据的列表 (需剔除 isVisible == 0 隐藏的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowStaticAndDynamicMenuList(menuList: any) {
  let newMenuList: any = JSON.parse(JSON.stringify(menuList));
  return newMenuList.filter((item: any) => {
    return item.isVisible == "1" || item.meta?.isVisible == "1";
  });
}

/**
 * @description 使用递归找出所有面包屑存储到 pinia 中
 * @param {Array} menuList 菜单列表
 * @param {Array} parent 父级菜单
 * @param {Object} result 处理后的结果
 * @returns {Object}
 */
export const getAllBreadcrumbList = (menuList: any, parent = [], result: { [key: string]: any } = {}) => {
  for (const item of menuList) {
    result[item.path] = [...parent, item];

    if (item.children) getAllBreadcrumbList(item.children, result[item.path], result);
  }
  return result;
};

/**
 * @description 根据activeMenu找到所有的层级面包屑
 * @param {Array} routes 菜单列表
 * @param {Array} activeMenu 选中菜单
 */
export const findRouteByActiveMenu = (routes: any, activeMenu: any) => {
  // 深度优先搜索函数
  const dfs = (node: any, path: any) => {
    // 创建当前节点的副本（不包含 children）
    const currentNode = { ...node };
    delete currentNode.children;
    
    // 添加到当前路径
    const currentPath = [...path, currentNode];
    
    // 检查是否匹配目标路径
    if (node.path === activeMenu) {
      return currentPath;
    }
    
    // 递归搜索子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result: any = dfs(child, currentPath);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // 遍历所有根节点
  for (const route of routes) {
    const result = dfs(route, []);
    if (result) return result;
  }
  
  return null;
};

/**
 * @description 根据activeMenu找到所有的层级面包屑和里面的children
 * @param {Array} routes 菜单列表
 * @param {Array} activeMenu 选中菜单
 */
export const findRouteChildrenByActiveMenu = (routes: any, activeMenu: any) => {
  // 深度优先搜索函数
  const dfs = (node: any, path: any) => {
    // 创建当前节点的完整副本（包含 children）
    const currentNode = { ...node };
    
    // 添加到当前路径
    const currentPath = [...path, currentNode];
    
    // 检查是否匹配目标路径
    if (node.path === activeMenu) {
      return currentPath;
    }
    
    // 递归搜索子节点
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        const result: any = dfs(child, currentPath);
        if (result) return result;
      }
    }
    
    return null;
  };
  
  // 遍历所有根节点
  for (const route of routes) {
    const result = dfs(route, []);
    if (result) return result;
  }
  
  return null;
};

const mode = import.meta.env.VITE_ROUTER_MODE;

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export const getUrlWithParams = () => {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  // @ts-ignore
  return url[mode];
}

/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export const getBrowserLang = () => {
  // 检查是否在浏览器环境中
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const browserLang = navigator.language || (navigator as any).browserLanguage;
    const lang = browserLang?.toLowerCase() || '';
    
    if (["cn", "zh", "zh-cn"].includes(lang)) {
      return "zh";
    }
  }
  // 默认返回英文或根据需求调整
  return "en";
}

import i18n from '@/languages/index.ts';

/**
 * @description i18n语言切换菜单标题[zh.ts en.ts等前端进行控制]
 * @param title 菜单标题，可以是 i18n 的 key，也可以是字符串
 */
export const getMenuLanguage = (title: string): string => {
  if (!title) return '';
  return title.startsWith('menu.') ? i18n.global.t(title) : title;
}

/**
 * 获取CSS变量值[别名函数]
 * @param name CSS变量名
 * @returns CSS变量值
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name)
}

/**
 * @description 数字转换为 K单位
 */
export const getFormatToK = (num: number): string  =>{
  if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(num);
};

