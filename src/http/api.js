export default {
  queryTestApi: '/octokit/octokit.rb',

  // 公共模块
  login: '/login', // 登录
  loginCaptchaConfig: '/open/loginCaptchaConfig', // 登录验证码开关
  loginCaptchaCode: '/open/loginCaptchaCode/{captchaId}', // 登录验证码
  logout: '/logout', // 退出
  getMenuList: '/sys/auths/menus/list', // 获取菜单
  getLoginedUserInfo: '/sys/users/current', // 获取当前用户
  // 获取全局字典项
  getGlobalDict: '/sys/dict/items/list', // 获取字典列表
  getSomeDict: '/sys/dict/items/group/list', // 获取某个组的字典

  // 测试
  getTest: '/getUserById',
  postTest: '/UpdateUser',
  putTest: '/put',
  deleteTest: '/deleteUserById',
  patchTest: '/patch',

  // java后台测试
  addUser: '/sys/users', // 添加用户
  queryUserById: '/sys/status/users/{userId}/test/{userName}',
  queryAllUser: '/sys/status/users/list',
  queryUser: '/sys/status/users/page',
  deleteUser: '/sys/users/{userId}',
  lockUser: 'sys/status/users/{userId}/lock',
  updateUser: '/sys/users/{userId}', // 更新用户信息
  batchOperationUser: '/sys/users/lock',
  batchUnlockUser: '/sys/users/unlock',
  disableUser: '/sys/users/{userId}/disabled',
  enabledUser: '/sys/users/{userId}/enabled',
  updateBatchPwByAdmin: '/sys/users/passwords', // 管理员批量修改用户密码

  // 系统管理
  // -权限管理
  // --用户管理
  getAllUserList: '/sys/users/page', // 获取所有用户分页
  getUserAuthById: '/sys/tenant/auth/list', // 查询用户权限
  getUserInfoById: '/sys/users/{userId}', // 根据id查询用户
  updateUserAuth: '/sys/users/{userId}/auths', // 更新用户授权
  getUserAllAuth: '/sys/users/{userId}/auths', // 获取用户授权
  updateUserRole: '/sys/users/{userId}/roles', // 更新用户角色
  getUserRole: '/sys/users/{userId}/roles', // 获取用户角色
  getUserRolePage: '/sys/users/roles/page/{userId}', // 获取用户角色
  getAllRoleUserList: '/sys/users/page/roleInfo', // 获取角色列表
  getCurrentUserMenuList: '/sys/users/current/menu-list', // 当前用户所有菜单权限
  getCurrentUserAllAuthList: '/sys/users/current/auth-list', // 当前用户所有权限
  addUserRole: '/sys/users/{userId}/addRoles', // 新增用户角色
  deleteRolesByUserId: '/sys/users/{userId}/roles', // 删除用户下角色
  importUser: '/sys/users/importUser', // 导入用户

  // -平台管理
  // --权限管理
  getAllAuthTree: '/sys/auths/list', // 获取所有权限的权限树
  getAuthById: '/sys/auths/{authId}', // 获取权限id获取权限
  addAuth: '/sys/auths', // 添加权限
  updateAuth: '/sys/auth/update', // 更新权限
  updateAuthById: '/sys/auths/{authId}', // 根据权限id更新权限
  getAllMenu: '/sys/auths/menus/list', // 获取所有菜单权限
  deleteAuth: '/sys/auths/{authId}', // 删除单个权限
  getAllAuthUsers: '/sys/users/page/auths/{authId}', // 获取某个权限授权的用户
  getAllAuthRoles: '/sys/roles/page/{authId}', // 获取某个权限授权的角色
  grantAuthToUsers: '/sys/auths/{authId}/users', // 将某个权限授权给用户
  revokeAuthToUsers: '/sys/auths/{authId}/users', // 取消某个权限授权给用户
  grantAuthToRoles: '/sys/auths/{authId}/roles', // 将某个权限授权给角色
  revokeAuthToRoles: '/sys/auths/{authId}/roles', // 取消某个权限授权给角色
  queryCurrentAuth: '/sys/tenants/auth/list/current', // 获取当前租户的权限列表
  // -权限管理
  // --角色权限
  addRole: '/sys/roles', // 添加角色
  queryAllRole: '/sys/roles/page', // 查询所有角色
  updateRoleAuth: '/sys/roles/{roleId}/auths', // 更新角色授权
  deleteRole: '/sys/roles/{roleId}', // 删除角色
  getRoleById: '/sys/roles/{roleId}', // 根据角色id获取角色
  updateRoleById: '/sys/roles/{roleId}', // 更新单个角色
  addUsersInBatches: '/sys/roles/{roleId}/users/', // 添加角色关联的用户
  getRolesAuth: '/sys/roles/{roleId}/auths', // 获取角色关联的权限
  deleteRoleUser: '/sys/roles/{userRoleId}/deleteUser', // 删除用户关联的用户
  revokeRoleToUsers: '/sys/roles/{roleId}/deleteUsers', // 批量删除用户关联的用户
  // -系统配置
  // --系统设置
  queryAllConfig: '/sys/configs/page', // 查询系统配置
  addConfig: '/sys/configs', // 添加系统配置
  deleteConfig: '/sys/configs/{configId}', // 删除系统配置
  updateConfig: '/sys/configs/{configId}', // 更新系统配置
  getConfigById: '/sys/configs/{configId}', // 获取单个系统配置

  // -系统配置
  // --ip设置
  queryAllIps: '/sys/ips/page', // 查询ip配置
  addIps: '/sys/ips', // 添加ip配置
  deleteIps: '/sys/ips/{ipId}', // 删除ip配置
  updateIps: '/sys/ips/{ipId}', // 更新ip配置
  getIpsById: '/sys/ips/{ipId}', // 获取单个ip配置

  // -系统配置
  // --配置运维
  // ----区域管理
  queryAllSysGlobalArea: '/sys/areas/page', // 查询区域列表

  // -系统配置
  // --字典设置
  // 字典组
  queryAllDictGroup: '/sys/dict/groups/page', // 查询字典组分页
  addDictGroup: '/sys/dict/groups', // 添加字典组
  deleteDictGroup: '/sys/dict/groups/{dictGroupId}', // 删除字典组
  updateDictGroup: '/sys/dict/groups/{dictGroupId}', // 更新字典组
  getDictGroupById: '/sys/dict/groups/{dictGroupId}', // 获取单个字典组
  // 字典项
  queryAllDictItem: '/sys/dict/items/page', // 查询字典项
  addDictItem: '/sys/dict/items', // 添加字典项
  deleteDictItem: '/sys/dict/items/{dictItemId}', // 删除字典项
  updateDictItem: '/sys/dict/items/{dictItemId}', // 更新字典项
  getDictItemById: '/sys/dict/items/{dictItemId}', // 获取单个字典项
  // -权限管理
  // --职位组管理
  getPositionGroupTree: '/sys/positionGroup/group/tree', // 职位组树
  // addPositionGroup: '/sys/positionGroup/add', // 添加职位组
  deletePositionGroup: '/sys/positions/groups/{positionGroupId}', // 删除职位组
  updatePositionGroup: '/sys/positions/groups/{positionGroupId}', // 更新职位组
  addPositionGroup: '/sys/positions/groups', // 新增职位组
  // --职位管理
  addPosition: '/sys/positions', // 添加职位
  deletePosition: '/sys/positions/{positionId}', // 删除职位
  updatePosition: '/sys/positions/{positionId}', // 更新职位
  getPostioniTree: '/sys/positions/groups/tree', // 查询职位组下有哪些职位
  getPostionList: '/sys/positions/users/list', // 根据职位查用户部门关系
  savePostion: '/sys/positions/users', // 保存职位用户关系
  deletePositionUser: '/sys/positions/users', // 批量移除用户职位关系
  setManager: '/sys/positions/users/manager', // 设置管理范围
  getPositionUserJoinList: '/sys/positions/{userId}/list', // 查询用户职位管理
  // --职位下用户
  deletePositionUserByBatches: '/sys/position/remove/batch', // 删除职位下用户
  // -权限管理
  // --部门管理
  getOrganizationTree: '/sys/organizations/tree', // 组织树
  // 根据部门ID查找部门
  getOrganList: '/sys/organizations/{orgId}', // 根据id查部门
  getUserList: '/sys/organizations/user/list', // 获取部门下用户
  addOrganization: '/sys/organizations', // 添加组织
  deleteOrganization: '/sys/organizations/{orgId}', // 删除组织
  updateOrganization: '/sys/organizations/{orgId}', // 更新组织
  deleteOrganizationUserByBatches: '/sys/organizations/users/join', // 删除组织下关联用户
  saveOrganUserRelative: '/sys/organizations/users/join', // 添加组织下关联用户
  selectOrgByUserId: '/sys/organizations/{userId}/list', // 查询用户所在的组织
  // --日志管理
  getAllSysLogList: '/sys/logs/page', // 查询日志
  // 租户管理
  queryAllTenants: '/sys/tenants/page', // 查询租户
  addTenants: '/sys/tenants', // 添加租户
  updateTenantsAuth: '/sys/tenants/{tenantId}/auths', // 更新租户授权
  queryTenantInfoById: '/sys/tenants/', // 查询租户
  getTenantAllAuth: '/sys/tenants/{tenantId}/auth/list', // 获取租户授权
  startTenant: '/sys/tenants/{tenantId}/enabled', // 启用租户
  stopTenant: '/sys/tenants/{tenantId}/disabled', // 停用租户
  updateTenant: '/sys/tenants/{tenantId}', // 更新租户

  // 授予租户
  queryTenantPowerList: '/sys/tenants/page/tenant/{authId}', // 根据权限id查询租户
  deleteTenantPower: '/sys/tenants/grant/{authId}', // 删除租户授权
  addTenantPower: '/sys/tenants/grant/{authId}', // 添加租户授权
  updateTenantPwd: '/sys/tenants/passwords', // 管理员批量修改租户密码

  // --个人中心
  // --密码管理
  // --修改密码
  updatePassWord: '/sys/users/password-change', // 修改密码
  updateExpirePassword: '/sys/users/password-expire-change', // 密码周期性校验

  // 流程管理
  // 流程定义
  queryAllFlowProcessDefinition: '/flow/process-definitions/page', // 查询流程定义
  addFlowProcessDefinition: '/flow/process-definitions', // 添加流程定义
  deleteFlowProcessDefinition: '/flow/process-definitions/{id}', // 删除流程定义
  updateFlowProcessDefinition: '/flow/process-definitions/{id}', // 更新流程定义
  getFlowProcessDefinitionById: '/flow/process-definitions/{id}', // 获取单个流程定义

  // 流程实例
  queryAllFlowProcessInstance: '/flow/process-instances/page', // 查询流程实例
  addFlowProcessInstance: '/flow/process-instances', // 添加流程实例
  deleteFlowProcessInstance: '/flow/process-instances/{id}', // 删除流程实例
  updateFlowProcessInstance: '/flow/process-instances/{id}', // 更新流程实例
  getFlowProcessInstanceById: '/flow/process-instances/{id}', // 获取单个流程实例

  // 请假管理
  queryAllLeave: '/demo/leaves/page', // 查询请假单信息
  addLeave: '/demo/leaves', // 添加请假单信息
  deleteLeave: '/demo/leaves/{leaveId}', // 删除请假单信息
  updateLeave: '/demo/leaves/{leaveId}', // 更新请假单信息
  getLeavesById: '/demo/leaves/{leaveId}', // 获取单个请假单信息
  getLeavesByProInstId: '/demo/leaves/getLeavesByProInstId/{procInstId}', // 获取单个请假单信息
  startLeave: '/demo/leaves/start/{leaveId}/{procKey}', // 发起请假
  completeLeave: '/demo/leaves/completeLeave', // 审批
  getToDoTaskPageList: '/processTask/hbpmsProcinstTask/getToDoTaskPageList', // 获取待办任务列表
  getInstanceImage: '/processInstance/hbpmsProcessInstance/getInstanceImage', // 获取流程图
  getApprovalHistoryList: '/processTask/hbpmsProcinstTask/getApprovalHistoryList', // 获取历史审批任务
  // --资源管理
  queryAllSysFileList: '/sys/files/page',
  updateSysFile: '/sys/files/{fileId}', // 更新附件
  downloadSysFile: '/sys/files/{fileId}/download', // 下载附件
  uploadSysFile: '/sys/files/upload', // 附件上传

  // 系统服务运行实例管理
  queryAllSysGlobalInstance: '/sys/globalInstances/page', // 查询系统服务运行实例管理
  addSysGlobalInstance: '/sys/globalInstances', // 添加系统服务运行实例管理
  deleteSysGlobalInstance: '/sys/globalInstances/{id}', // 删除系统服务运行实例管理
  updateSysGlobalInstance: '/sys/globalInstances/{id}', // 更新系统服务运行实例管理
  getSysGlobalInstanceById: '/sys/globalInstances/{id}', // 获取单个系统服务运行实例管理
  // 系统运行实例 监控数据
  getSysGlobalInstanceDruid: '/sys/globalInstances/monitor/druid', // 获得 hpc-actuator druid 监控数据
  getSysGlobalInstanceRedis: '/sys/globalInstances/monitor/redis', // 获得 hpc-actuator redis 监控数据
  getSysGlobalInstanceHealth: '/sys/globalInstances/monitor/health', // 获得 hpc-actuator health 监控数据
  getSysGlobalInstanceMetrics: '/sys/globalInstances/monitor/metrics', // 获得 hpc-actuator metrics 监控数据
  getSysGlobalInstanceMetricsByName: '/sys/globalInstances/monitor/metrics/{requiredMetricName}', // 获得 hpc-actuator metrics 具体指标监控数据
  getSysGlobalInstanceCaches: '/sys/globalInstances/monitor/caches', // 获得 hpc-actuator caches 监控数据
  getSysGlobalInstanceEnv: '/sys/globalInstances/monitor/env', // 获得 hpc-actuator env 具体属性 监控数据
  getSysGlobalInstanceEnvByProp: '/sys/globalInstances/monitor/env/{toMatch}', // 获得 hpc-actuator env 具体属性 监控数据
  getSysGlobalInstanceScheduler: '/sys/globalInstances/monitor/scheduler/{methodName}', // 获得 hpc-actuator scheduler 具体属性 监控数据
  getSysGlobalInstanceThreadDump: '/sys/globalInstances/monitor/threaddump', // 获得 hpc-actuator threaddump 具体属性 监控数据
  getSysGlobalInstanceLoggers: '/sys/globalInstances/monitor/loggers', // 获得 hpc-actuator loggers 具体属性 监控数据
  getSysGlobalInstanceLoggersByName: '/sys/globalInstances/monitor/loggers/{name}', // 获得 hpc-actuator loggers 具体属性 监控数据

  // demo管理-员工统计
  getFirstLevelOrgList: '/demo/staffStatistics/getFirstLevelOrgList',
  getStaffStatisticsChartData: '/demo/staffStatistics/getChartData'
}
