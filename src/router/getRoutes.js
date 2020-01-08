import RootPlaceholderRouter from '@/components/base/RootPlaceholderRouter'
import PlaceholderRouter from '@/components/base/PlaceholderRouter'

// name值必须与配置路由的编码一致
export const originChildren = [
  {
    path: 'homePage',
    name: 'homePage',
    redirect: 'homePage/list',
    meta: {},
    component: () => import('@/views/home/homePage/index'),
    children: [
      {
        path: 'list',
        name: 'homePage_list',
        meta: {},
        component: () => import('@/views/home/homePage/list/index')
      }
    ]
  },
  {
    path: 'system',
    name: 'system',
    redirect: 'system/auth',
    meta: {},
    component: RootPlaceholderRouter,
    children: [
      {
        path: 'auth',
        name: 'system_auth',
        redirect: 'auth/userManagement',
        meta: {},
        component: PlaceholderRouter,
        children: [
          {
            path: 'userManagement',
            name: 'system_auth_user',
            redirect: 'userManagement/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_auth_user_list',
                meta: {
                  dicts: ['sex', 'userType']
                },
                component: () => import('@/views/home/system/auth/userManagement/list')
              },
              {
                path: 'edit/:id',
                name: 'system_auth_user_edit',
                meta: {
                  dicts: ['sex', 'userType', 'operCode']
                },
                component: () => import('@/views/home/system/auth/userManagement/edit')
              },
              {
                path: 'scan/:id',
                name: 'system_auth_user_scan', // 和用户编辑跳转一个页面，为了区分查看和编辑的按钮权限，防止只配查看权限时，页面被拦截至404
                meta: {
                  dicts: ['sex', 'userType', 'operCode']
                },
                component: () => import('@/views/home/system/auth/userManagement/edit')
              }
            ]
          },
          {
            path: 'roleManagement',
            name: 'system_auth_role',
            redirect: 'roleManagement/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_auth_role_list',
                meta: {
                  dicts: ['sex']
                },
                component: () => import('@/views/home/system/auth/roleManagement/list/index')
              },
              {
                path: 'edit/:id',
                name: 'system_auth_role_edit',
                meta: {},
                component: () => import('@/views/home/system/auth/roleManagement/edit/index')
              },
              {
                path: 'scan/:id',
                name: 'system_auth_role_scan',
                meta: {},
                component: () => import('@/views/home/system/auth/roleManagement/edit/index')
              }
            ]
          },
          {
            path: 'auth',
            name: 'system_auth_auth',
            redirect: 'auth/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_auth_auth_list',
                meta: {},
                component: () => import('@/views/home/system/auth/auth')
              },
              {
                path: 'distribute',
                name: 'system_auth_auth_distribute',
                meta: {},
                component: () => import('@/views/home/system/auth/auth/distribute')
              }
            ]
          },
          {
            path: 'positionManagement',
            name: 'system_auth_staff',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'positionManagement/list',
            children: [
              {
                path: 'list',
                name: 'system_auth_staff_list',
                meta: {},
                component: () => import('@/views/home/system/auth/positionManagement')
              }
            ]
          },
          {
            path: 'structure',
            name: 'system_auth_structure',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'structure/list',
            children: [
              {
                path: 'list',
                name: 'system_auth_structure_list',
                meta: {},
                component: () => import('@/views/home/system/auth/structure')
              }
            ]
          }
        ]
      },
      {
        path: 'config',
        name: 'system_config',
        redirect: 'config/systemConfig',
        component: PlaceholderRouter,
        meta: {},
        children: [
          {
            path: 'setting',
            name: 'system_config_setting',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'setting/list',
            children: [
              {
                path: 'list',
                name: 'system_config_setting_list',
                meta: {},
                component: () => import('@/views/home/system/config/system')
              }
            ]
          },
          {
            path: 'dictionaryConfig',
            name: 'system_config_dictionary',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'dictionaryConfig/list',
            children: [
              {
                path: 'list',
                name: 'system_config_dictionary_list',
                meta: {},
                component: () => import('@/views/home/system/config/dictionary')
              }
            ]
          },
          {
            path: 'ipConfig',
            name: 'system_config_ipConfig',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'ipConfig/list',
            children: [
              {
                path: 'list',
                name: 'system_config_ipConfig_list',
                meta: {
                  dicts: ['ipType', 'ipTimeLimit']
                },
                component: () => import('@/views/home/system/config/ip')
              }
            ]
          },
          {
            path: 'regionalConfig',
            name: 'system_config_regional',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'regionalConfig/list',
            children: [
              {
                path: 'list',
                name: 'system_config_regional_list',
                meta: {
                  dicts: ['areaType']
                },
                component: () => import('@/views/home/system/config/regional')
              }
            ]
          }
        ]
      },
      {
        path: 'asset',
        name: 'system_asset',
        meta: {},
        component: PlaceholderRouter,
        redirect: 'asset/list',
        children: [
          {
            path: 'list',
            name: 'system_asset_list',
            meta: {},
            component: () => import('@/views/home/system/asset')
          }
        ]
      },
      {
        path: 'platform',
        name: 'system_platform',
        meta: {},
        component: PlaceholderRouter,
        children: [
          {
            path: 'authManagement',
            name: 'system_platform_authManagement',
            redirect: 'authManagement/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_platform_authManagement_list',
                meta: {
                  dicts: ['authType', 'actionType']
                },
                component: () => import('@/views/home/system/platform/authManagement/list')
              },
              {
                path: 'distribute/:id',
                name: 'system_platform_authManagement_distribute',
                meta: {},
                component: () => import('@/views/home/system/platform/authManagement/distribute')
              }
            ]
          },
          {
            path: 'tenantManagement',
            name: 'system_platform_tenant',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'tenantManagement/list',
            children: [
              {
                path: 'list',
                name: 'system_platform_tenant_list',
                meta: {},
                component: () => import('@/views/home/system/platform/tenantManagement/list')
              },
              {
                path: 'edit/:id',
                name: 'system_platform_tenant_edit',
                meta: {},
                component: () => import('@/views/home/system/platform/tenantManagement/edit')
              },
              {
                path: 'scan/:id', // 和租户编辑跳转一个页面，为了区分查看和编辑的按钮权限，防止只配查看权限时，页面被拦截至404
                name: 'system_platform_tenant_scan',
                meta: {},
                component: () => import('@/views/home/system/platform/tenantManagement/edit')
              }
            ]
          }
        ]
      },
      {
        path: 'flow',
        name: 'system_flow',
        redirect: 'flow/processDefinition',
        meta: {},
        component: PlaceholderRouter,
        children: [
          // 流程定义 FlowProcessDefinition processDefinition
          {
            path: 'processDefinition',
            name: 'system_flow_processDefinition',
            redirect: 'processDefinition/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_flow_processDefinition_list',
                meta: {},
                component: () =>
                  import('@/views/home/system/flow/processDefinition')
              }
            ]
          },
          // 流程实例 FlowProcessInstance processInstance
          {
            path: 'processInstance',
            name: 'system_flow_processInstance',
            redirect: 'processInstance/list',
            meta: {},
            component: PlaceholderRouter,
            children: [
              {
                path: 'list',
                name: 'system_flow_processInstance_list',
                meta: {},
                component: () =>
                  import('@/views/home/system/flow/processInstance')
              }
            ]
          }
        ]
      },
      {
        path: 'sysLogManagement',
        name: 'system_log',
        meta: {},
        component: PlaceholderRouter,
        redirect: 'sysLogManagement/list',
        children: [
          {
            path: 'list',
            name: 'system_log_list',
            meta: {
              dicts: ['operCode']
            },
            component: () => import('@/views/home/system/sysLog')
          }
        ]
      },
      {
        path: 'exception',
        name: 'system_exception',
        meta: {},
        component: PlaceholderRouter,
        redirect: 'exception/404',
        children: [
          {
            path: '404',
            name: 'system_exception_404',
            meta: {},
            component: PlaceholderRouter,
            redirect: '404/list',
            children: [
              {
                path: 'list',
                name: 'system_exception_404_list',
                meta: {},
                component: () => import('@/views/home/system/exception/404')
              }
            ]
          }
        ]
      },
      // 系统服务运行实例管理 SysGlobalInstance globalInstance
      {
        path: 'globalInst',
        name: 'system_globalInst',
        redirect: 'globalInst/list',
        meta: {},
        component: PlaceholderRouter,
        children: [
          {
            path: 'list',
            name: 'system_globalInst_list',
            meta: {},
            component: () => import('@/views/home/system/globalInstance')
          },
          {
            path: 'monitor',
            name: 'system_globalInst_monitor',
            meta: {},
            component: () => import('@/views/home/system/monitor')
          }
        ]
      }
    ]
  },
  {
    path: 'userCenter',
    name: 'userCenter',
    redirect: 'userCenter/userPage',
    meta: {},
    component: RootPlaceholderRouter,
    children: [
      {
        path: 'userPage',
        name: 'userCenter_userPage',
        redirect: 'userPage/userInfo',
        meta: {},
        component: PlaceholderRouter,
        children: [
          {
            path: 'userInfo',
            name: 'userCenter_userPage_userInfo',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'userInfo/main',
            children: [
              {
                path: 'main',
                name: 'userCenter_userPage_userInfo_main',
                meta: {
                  dicts: ['sex', 'userType', 'operCode']
                },
                component: () => import('@/views/home/userCenter/userPage/userInfo')
              }
            ]
          },
          {
            path: 'passwordManagement',
            name: 'userCenter_userPage_password',
            meta: {},
            component: PlaceholderRouter,
            redirect: 'passwordManagement/main',
            children: [
              {
                path: 'main',
                name: 'userCenter_userPage_password_main',
                meta: {},
                component: () => import('@/views/home/userCenter/userPage/passwordManagement/edit')
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'demo',
    name: 'demo',
    redirect: 'demo/file',
    component: RootPlaceholderRouter,
    meta: {},
    children: [
      {
        path: 'file',
        name: 'demo_file',
        meta: {},
        component: PlaceholderRouter,
        redirect: 'file/list',
        children: [
          {
            path: 'list',
            name: 'demo_file_list',
            meta: {},
            component: () => import('@/views/home/demo/file')
          }
        ]
      },
      {
        path: 'staffStatistics',
        name: 'demo_staffStatistics',
        meta: {},
        component: PlaceholderRouter,
        redirect: 'staffStatistics/list',
        children: [
          {
            path: 'list',
            name: 'demo_staffStatistics_list',
            meta: {},
            component: () => import('@/views/home/demo/staffStatistics')
          }
        ]
      }
    ]
  }
]
