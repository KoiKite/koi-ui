export default {
  project: {
    title: "KOI-ADMIN"
  },
  menu: {
    login: {
      auth: "Login",
      title: "KOI-ADMIN Platform",
      welcome: "Welcome to login",
      platform: "Management platform",
      description: "Maybe we just got lucky",
      account: "Account password login",
      in: "Log in",
      loading: "Be logging in",
      beiAnHao: "Website record number",
      picture: "I can't see it. Change it",
      form: {
        loginName: "Please enter your username",
        password: "Please enter password",
        securityCode: "Please enter the verification code",
      },
      rules: {
        loginName: {
          required: "The user name cannot be empty",
          validator: "The account can only contain numbers and letters"
        },
        password: {
          required: "The password cannot be empty",
          validator1: "6 to 20 characters in length",
          validator2: "The password must contain both numbers and letters",
        },
        securityCode: {
          required: "The verification code cannot be empty"
        }
      }
    },
    home: {
      auth: "Master Station",
      work: {
        name: "Workbench page"
      },
      analysis: {
        name: "Analysis page"
      },
      console: {
        name: "Console Page"
      }
    },
    system: {
      auth: "System Manage",
      user: {
        name: "User Manage",
        search: {
          label: {
            loginName: "Login name",
            userName: "User name",
            phone: "Phone number",
            deptId: "Department",
            loginTime: "Login time",  
          },
          placeholder: {
            loginName: "Please enter your login account",
            userName: "Please enter the user name",
            phone: "Please enter your phone number",
            deptId: "Please select a department",
          }
        },
        table: {
          loginName: "Login name",
          deptName: "Department",
          avatar: "Avatar",
          userName: "User name",
          email: "Email",
          phone: "Phone number",
          userType: "User type",
          sex: "Gender",
          userStatus: "User status",
          loginTime: "Login time"
        },
        form: {
          label: {
            loginName: "Login name",
            password: "Password",
            userName: "User name",
            deptId: "Department",
            postId: "Job allocation",
            roleId: "Assign roles",
            userType: "User type",
            userStatus: "User status",
            sex: "Gender",
            avatar: "Avatar",
            phone: "Phone number",
            email: "Email",
            remark: "Remark"
          },
          placeholder: {
            loginName: "Please enter your login account",
            password: "Please enter your password",
            userName: "Please enter the user name",
            deptId: "Please select a department",
            postId: "Please select the position",
            roleId: "Please select a role",
            userType: "Please select the user type",
            userStatus: "Please select the user status",
            sex: "Please select the user's gender",
            avatar: {
              description: "Upload an avatar",
              tip: "The maximum size of the picture is 3M"
            },
            phone: "Please enter your phone number",
            email: "Please enter your email address",
            remark: "Please enter the user's remarks"
          }
        },
        rules: {
          loginName: { required: "Please enter your login account" },
          password: { required: "Please enter your user password", validator: "At least 6 digits and containing letters and numbers" },
          userName: { required: "Please enter the user name"},
          deptId: { required: "Please select the department" },
          userType: { required: "Please enter the user type" },
          sex: { required: "Please select the user's gender" },
          userStatus: { required: "Please select the user status" },
          phone: { required: "Please enter your phone number" }
        },
        transfer: {
          role: "List of roles",
          post: "Job list"
        }
      },
      role: {
        name: "Role Manage"
      },
      menu: {
        name: "Menu Manage"
      },
      dictType: {
        name: "DictType Manage"
      },
      dictData: {
        name: "DictData Manage"
      },
      dept: {
        name: "Dept Manage"
      },
      post: {
        name: "Post Manage"
      },
      loginLogs: {
        name: "Login Logs"
      },
      operateLogs: {
        name: "Operate Logs"
      },
      notice: {
        name: "Notice Manage"
      },
      personage: {
        name: "Personage Center"
      }
    },
    monitor: {
      auth: "System Monitor",
      scheduled: {
        name: "Scheduled Task"
      },
      online: {
        name: "Online User"
      },
      service: {
        name: "Service Monitor"
      },
      redis: {
        name: "Redis Monitor"
      },
      cache: {
        name: "Data Cache"
      },
      blocklist: {
        name: "Blocklist Manage"
      }
    },
    tools: {
      auth: "System Tool",
      generate: {
        name: "Code Generate"
      },
      config: {
        name: "Code Config"
      },
      file: {
        name: "Files Manage"
      },
      picture: {
        name: "Pictures Manage"
      },
      testDept: {
        name: "TestDept Manage"
      },
      testParams: {
        name: "TestDept Params"
      }
    },
    link: {
      auth: "External Link",
      back: {
        name: "Back Version"
      },
      front: {
        name: "Front Version"
      },
      blog: {
        name: "Blog Version"
      },
      element: {
        name: "ElementPlus"
      }
    },
    blog: {
      auth: "Blog Manage",
      category: {
        name: "Article Category"
      },
      tag: {
        name: "Tags Manage"
      },
      article: {
        name: "Article Manage"
      },
      friend: {
        name: "Friend Link"
      },
      circle: {
        name: "Circle Manage"
      },
      danMu: {
        name: "DanMu Manage"
      },
      notice: {
        name: "Notice Manage"
      },
      library: {
        name: "Knowledge Base"
      },
      libraryCatalog: {
        name: "Knowledge Catalog"
      },
      libraryPreview: {
        name: "Knowledge Preview"
      },
      comment: {
        name: "Comment Manage"
      },
    },
    coding: {
      404: {
        name: "404 Page"
      },
      403: {
        name: "403 Page"
      },
      500: {
        name: "500 Page"
      }
    }
  },
  button: {
    search: "Search",
    reset: "Reset",
    add: "Add",
    update: "Update",
    delete: "Delete",
    export: "Export",
    import: "Import",
    preview: "Preview",
    password: "Reset Password",
    expand: "Expand/Fold",
    role: "Assign Roles",
    post: "Assign Jobs",
    menu: "Assign Menu",
    dept: "Assign Dept",
    refreshCache: "Refresh Cache",
    view: "View",
    detail: "Detail",
    save: "Save",
    force: "Force Offline",
    logout: "Logout",
    execute: "Execute",
    executeOnce: "Execute Once",
    file: "File Upload",
    image: "Image Upload",
    upload: "Upload",
    download: "Download",
    confirm: "Confirm",
    cancel: "Cancel",
    refresh: "Refresh",
    hideSearch: "Hide Search",
    displaySearch: "Display Search",
    close: "Close",
    genCode: "Generate Code",
    previewCode: "Preview Code",
    sync: "Sync",
    switch: "Switch",
    publish: "Publish",
    catalog: "Catalog"
  },
  home: {
    welcome: "Welcome"
  },
  tabs: {
    refresh: "Refresh",
    maximize: "Maximize",
    closeCurrent: "Close Current",
    closeLeft: "Close Left",
    closeRight: "Close Right",
    closeOther: "Close Other",
    closeAll: "Close All"
  },
  header: {
    searchMenu: "Search menu",
    componentSize: "Component size",
    refreshCache: "Refresh cache",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language translation",
    fullScreen: "Full Screen",
    exitFullScreen: "Exit Full Screen",
    personalCenter: "Personal Center",
    settings: "Settings",
    logout: "Log out",
    dimensionList: {
      default: "default",
      large: "large",
      small: "small"
    },
    languageList: {
      chinese: "Chinese",
      english: "English"
    },
    menuSearch: "Menu search: Support menu name, path"
  },
  msg: {
    success: "Operation successful",
    fail: "Operation failed. Please refresh and try again",
    selectData: "Please select the data",
    validFail: "Validation failed. Please check the form contents",
    null: "No data for now",
    closeTips: "Are you sure you want to close it?",
    closed: "Closed",
    cancelled: "Cancelled",
    remind: "Friendly reminder:",
    confirmWant: "Do you confirm that you want",
    confirmDelete: "Are you sure you want to delete it?",
    confirmLogin: "The account identity has expired, please log in again",
    selectDate: "Please select a date",
    selectDateTime: "Please select a date and time",
    selectNumber: "Please enter the number",
    beginTime: "Begin Time",
    endTime: "End Time",
    to: "to",
    keyword: "Keyword search",
    configFail: "Configuration failed",
    logIn: "Please log in again",
    yzmFail: "Captcha acquisition failed"
  },
  table: {
    number: "#",
    operate: "Operation"
  },
  tree: {
    topLevel: "Top level data",
    selectParent: "Please select parent data"
  },
  dict: {
    sys_switch_status: {
      open: "open",
      stop: "stop",
    },
    sys_user_sex: {
      man: "man",
      woman: "woman",
      unknown: "unknown"
    },
    sys_yes_no: {
      yes: "yes",
      no: "no"
    }
  }
};
