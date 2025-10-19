export default {
  project: {
    title: "KOI-ADMIN"
  },
  menu: {
    login: {
      auth: "登录",
      title: "KOI-ADMIN 管理平台",
      welcome: "欢迎登录",
      platform: "管理平台",
      description: "或许我们只是差点运气",
      account: "账号密码登录",
      in: "登录",
      loading: "登录中",
      beiAnHao: "网站备案号",
      picture: "看不清，换一张",
      form: {
        loginName: "请输入用户名",
        password: "请输入密码",
        securityCode: "请输入验证码"
      },
      rules: {
        loginName: {
          required: "用户名不能为空",
          validator: "账号只能包含数字和字母"
        },
        password: {
          required: "密码不能为空",
          validator1: "长度在 6 到 20 个字符",
          validator2: "密码必须包含数字和字母",
        },
        securityCode: {
          required: "验证码不能为空"
        }
      }
    },
    home: {
      auth: "主控台",
      work: {
        name: "工作台"
      },
      analysis: {
        name: "分析页"
      },
      console: {
        name: "控制台"
      }
    },
    system: {
      auth: "系统管理",
      user: {
        name: "用户管理",
        search: {
          label: {
            loginName: "登录账号",
            userName: "用户名称",
            phone: "手机号",
            deptId: "部门",
            loginTime: "登录时间",
          },
          placeholder: {
            loginName: "请输入登录账号",
            userName: "请输入用户名称",
            phone: "请输入手机号",
            deptId: "请选择部门",
          }
        },
        table: {
          loginName: "登录账号",
          deptName: "部门名称",
          avatar: "头像",
          userName: "用户名称",
          email: "邮箱",
          phone: "手机号",
          userType: "用户类型",
          sex: "用户性别",
          userStatus: "用户状态",
          loginTime: "登录时间"
        },
        form: {
          label: {
            loginName: "登录账号",
            password: "登录密码",
            userName: "用户名称",
            deptId: "部门名称",
            postId: "分配岗位",
            roleId: "分配角色",
            userType: "用户类型",
            userStatus: "用户状态",
            sex: "用户性别",
            avatar: "用户头像",
            phone: "手机号",
            email: "邮箱",
            remark: "用户备注"
          },
          placeholder: {
            loginName: "请输入登录账号",
            password: "请输入登录密码",
            userName: "请输入用户名称",
            deptId: "请选择部门",
            postId: "请选择岗位",
            roleId: "请选择角色",
            userType: "请选择用户类型",
            userStatus: "请选择用户状态",
            sex: "请选择用户性别",
            avatar: {
              description: "请上传头像",
              tip: "图片最大为 3M"
            },
            phone: "请输入手机号码",
            email: "请输入邮箱",
            remark: "请输入用户备注"
          }
        },
        rules: {
          loginName: { required: "请输入登录名称" },
          password: { required: "请输入用户密码", validator: "至少6位且包含字母和数字" },
          userName: { required: "请输入用户名字"},
          deptId: { required: "请选择用户部门" },
          userType: { required: "请输入用户类型" },
          sex: { required: "请选择用户性别" },
          userStatus: { required: "请选择用户状态" },
          phone: { required: "请输入手机号码" }
        },
        transfer: {
          role: "角色列表",
          post: "岗位列表"
        }
      },
      role: {
        name: "角色管理"
      },
      menu: {
        name: "菜单管理"
      },
      dictType: {
        name: "字典管理"
      },
      dictData: {
        name: "字典详情"
      },
      dept: {
        name: "部门管理"
      },
      post: {
        name: "岗位管理"
      },
      loginLogs: {
        name: "登录日志"
      },
      operateLogs: {
        name: "操作日志"
      },
      notice: {
        name: "通知公告"
      },
      personage: {
        name: "个人中心"
      }
    },
    monitor: {
      auth: "系统监控",
      scheduled: {
        name: "定时任务"
      },
      online: {
        name: "在线用户"
      },
      service: {
        name: "服务监控"
      },
      redis: {
        name: "Redis监控"
      },
      cache: {
        name: "数据缓存"
      },
      blocklist: {
        name: "阻止名单"
      }
    },
    tools: {
      auth: "系统工具",
      generate: {
        name: "代码生成"
      },
      config: {
        name: "代码配置"
      },
      file: {
        name: "文件管理"
      },
      picture: {
        name: "图库管理"
      },
      testDept: {
        name: "测试部门"
      },
      testParams: {
        name: "测试参数"
      }
    },
    link: {
      auth: "外部链接",
      back: {
        name: "前后端"
      },
      front: {
        name: "纯前端"
      },
      blog: {
        name: "博客版本"
      },
      element: {
        name: "ElementPlus"
      }
    },
    blog: {
      auth: "博客管理",
      category: {
        name: "文章类别"
      },
      tag: {
        name: "标签管理"
      },
      article: {
        name: "文章管理"
      },
      friend: {
        name: "友链管理"
      },
      circle: {
        name: "朋友圈"
      },
      danMu: {
        name: "弹幕管理"
      },
      notice: {
        name: "通知公告"
      },
      library: {
        name: "知识库管理"
      },
      libraryCatalog: {
        name: "知识库目录"
      },
      libraryPreview: {
        name: "知识库预览"
      },
      comment: {
        name: "评论管理"
      },
    },
    coding: {
      404: {
        name: "404 页面"
      },
      403: {
        name: "403 页面"
      },
      500: {
        name: "500 页面"
      }
    }
  },
  button: {
    search: "搜索",
    reset: "重置",
    add: "添加",
    update: "修改",
    delete: "删除",
    export: "导出",
    import: "导入",
    preview: "预览",
    password: "重置密码",
    expand: "展开/折叠",
    role: "分配角色",
    post: "分配岗位",
    menu: "分配菜单",
    dept: "分配部门",
    refreshCache: "刷新缓存",
    view: "查看",
    detail: "详情",
    save: "保存",
    force: "强退",
    logout: "注销",
    execute: "执行",
    executeOnce: "执行一次",
    file: "文件上传",
    image: "图片上传",
    upload: "上传",
    download: "下载",
    confirm: "确定",
    cancel: "取消",
    refresh: "刷新",
    hideSearch: "隐藏搜索",
    displaySearch: "显示搜索",
    close: "关闭",
    genCode: "生成代码",
    sync: "同步",
    switch: "切换",
    publish: "发布",
    catalog: "目录"
  },
  home: {
    welcome: "欢迎使用"
  },
  tabs: {
    refresh: "重新刷新",
    maximize: "全屏切换",
    closeCurrent: "关闭当前",
    closeLeft: "关闭左侧",
    closeRight: "关闭右侧",
    closeOther: "关闭其它",
    closeAll: "关闭所有"
  },
  header: {
    searchMenu: "搜索菜单",
    componentSize: "组件大小",
    refreshCache: "刷新缓存",
    lightMode: "明亮模式",
    darkMode: "暗黑模式",
    language: "语言翻译",
    fullScreen: "全屏",
    exitFullScreen: "退出全屏",
    settings: "设置",
    personalCenter: "个人中心",
    changePassword: "修改密码",
    logout: "退出登录",
    dimensionList: {
      default: "默认",
      large: "大型",
      small: "小型"
    },
    languageList: {
      chinese: "简体中文",
      english: "英文"
    },
    menuSearch: "菜单搜索：支持菜单名称、路径"
  },
  msg: {
    success: "操作成功",
    fail: "操作失败，请刷新重试",
    selectData: "请选择数据",
    validFail: "验证失败，请检查表单内容",
    null: "暂无数据",
    closeTips: "您确认进行关闭么？",
    closed: "已关闭",
    cancelled: "已取消",
    remind: "温馨提示：",
    confirmWant: "您确认要",
    confirmDelete: "您确认要删除么？",
    confirmLogin: "账号身份已过期，请重新登录",
    selectDate: "请选择日期",
    selectDateTime: "请选择日期时间",
    selectNumber: "请输入数字",
    beginTime: "开始日期",
    endTime: "结束日期",
    to: "至",
    keyword: "关键字搜索",
    configFail: "配置失败",
    logIn: "请重新登录",
    yzmFail: "验证码获取失败"
  },
  table: {
    number: "序号",
    operate: "操作"
  },
  tree: {
    topLevel: "最顶级数据",
    selectParent: "请选择上级数据"
  },
  dict: {
    sys_switch_status: {
      open: "启用",
      stop: "停用",
    },
    sys_user_sex: {
      man: "男",
      woman: "女",
      unknown: "未知"
    },
    sys_yes_no: {
      yes: "是",
      no: "否"
    }
  }
};
