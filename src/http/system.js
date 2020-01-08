import http from '@/base/http'
import api from './api'

// 流程定义
export const queryAllFlowProcessDefinition = (params, pagination) => {
  return http.getPage(api.queryAllFlowProcessDefinition, params, null, pagination)
}
export const deleteFlowProcessDefinition = (params, urlParams) => {
  return http.delete(api.deleteFlowProcessDefinition, params, urlParams)
}
export const updateFlowProcessDefinition = (params, urlParams) => {
  return http.put(api.updateFlowProcessDefinition, params, urlParams)
}
export const addFlowProcessDefinition = params => {
  return http.post(api.addFlowProcessDefinition, params)
}
export const getFlowProcessDefinitionById = (params, urlParams) => {
  return http.get(api.getFlowProcessDefinitionById, params, urlParams)
}

// 流程实例
export const queryAllFlowProcessInstance = (params, pagination) => {
  return http.getPage(api.queryAllFlowProcessInstance, params, null, pagination)
}
export const deleteFlowProcessInstance = (params, urlParams) => {
  return http.delete(api.deleteFlowProcessInstance, params, urlParams)
}
export const updateFlowProcessInstance = (params, urlParams) => {
  return http.put(api.updateFlowProcessInstance, params, urlParams)
}
export const addFlowProcessInstance = params => {
  return http.post(api.addFlowProcessInstance, params)
}
export const getFlowProcessInstanceById = (params, urlParams) => {
  return http.get(api.getFlowProcessInstanceById, params, urlParams)
}

// 系统管理
// --用户管理
const getAllUser = params => {
  return http.get(api.getAllUserList, params)
}
const getUserPage = (params, pagination) => {
  return http.getPage(api.getAllUserList, params, null, pagination)
}
const addUser = params => {
  return http.post(api.addUser, params)
}
const updateUser = (params, urlParams) => {
  return http.put(api.updateUser, params, urlParams)
}
const getUserAuthById = params => {
  return http.get(api.getUserAuthById, params)
}
const getUserInfoById = (params, urlParams) => {
  return http.get(api.getUserInfoById, params, urlParams)
}
const updateUserAuth = (params, urlParams) => {
  return http.put(api.updateUserAuth, params, urlParams)
}
const getUserAllAuth = (params, urlParams) => {
  return http.get(api.getUserAllAuth, params, urlParams)
}

export const deleteUser = (params, urlParams) => {
  return http.delete(api.deleteUser, params, urlParams)
}

export const updateUserRole = (params, urlParams) => {
  return http.post(api.updateUserRole, params, urlParams)
}

export const getUserRole = (params, urlParams) => {
  return http.get(api.getUserRole, params, urlParams)
}

export const getUserRolePage = (params, urlParams) => {
  return http.get(api.getUserRolePage, params, urlParams)
}

export const getAllRoleUser = params => {
  return http.get(api.getAllRoleUserList, params)
}

export const updateBatchPwByAdmin = params => {
  return http.post(api.updateBatchPwByAdmin, params)
}

export const addUserRole = (params, urlParams) => {
  return http.post(api.addUserRole, params, urlParams)
}
export const deleteRolesByUserId = (params, urlParams) => {
  return http.delete(api.deleteRolesByUserId, params, urlParams)
}

export const importUser = params => {
  return http.post(api.importUser, params, null, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 平台管理
// --权限管理
const getAllAuthTree = params => {
  return http.get(api.getAllAuthTree, params)
}
const addAuth = params => {
  return http.post(api.addAuth, params)
}
const deleteAuth = (params, urlParams) => {
  return http.delete(api.deleteAuth, params, urlParams)
}

const getAllMenu = params => {
  return http.get(api.getAllMenu, params)
}
const getAuthById = (params, urlParams) => {
  return http.get(api.getAuthById, params, urlParams)
}

const editAuthById = (params, urlParams) => {
  return http.put(api.updateAuthById, params, urlParams)
}

const getAllAuthUsers = (params, urlParams) => {
  return http.get(api.getAllAuthUsers, params, urlParams)
}

const getAllAuthRoles = (params, urlParams) => {
  return http.get(api.getAllAuthRoles, params, urlParams)
}

const grantAuthToUsers = (params, urlParams) => {
  return http.post(api.grantAuthToUsers, params, urlParams)
}

const revokeAuthToUsers = (params, urlParams) => {
  return http.delete(api.revokeAuthToUsers, params, urlParams)
}

const grantAuthToRoles = (params, urlParams) => {
  return http.post(api.grantAuthToRoles, params, urlParams)
}

const revokeAuthToRoles = (params, urlParams) => {
  return http.delete(api.grantAuthToRoles, params, urlParams)
}

// 平台管理
// --租户管理
const getTenantPage = (params, pagination) => {
  return http.getPage(api.queryAllTenants, params, null, pagination)
}
// 角色管理

export const queryAllRole = params => {
  return http.get(api.queryAllRole, params)
}
export const getRolePage = (params, pagination) => {
  return http.getPage(api.queryAllRole, params, null, pagination)
}
export const addRole = params => {
  return http.post(api.addRole, params)
}
export const updateRoleAuth = (params, urlParams) => {
  return http.post(api.updateRoleAuth, params, urlParams)
}
export const deleteRole = (params, urlParams) => {
  return http.delete(api.deleteRole, params, urlParams)
}
export const getRoleById = (params, urlParams) => {
  return http.get(api.getRoleById, params, urlParams)
}
export const updateRoleById = (params, urlParams) => {
  return http.put(api.updateRoleById, params, urlParams)
}

export const addUsersInBatches = (params, urlParams) => {
  return http.post(api.addUsersInBatches, params, urlParams)
}

export const batchOperationUser = (params, urlParams) => {
  return http.post(api.batchOperationUser, params, urlParams)
}

export const batchUnlockUser = (params, urlParams) => {
  return http.post(api.batchUnlockUser, params, urlParams)
}

export const disableUser = (params, urlParams) => {
  return http.post(api.disableUser, params, urlParams)
}

export const enabledUser = (params, urlParams) => {
  return http.post(api.enabledUser, params, urlParams)
}

export const getRolesAuth = (params, urlParams) => {
  return http.get(api.getRolesAuth, params, urlParams)
}
export const deleteRoleUser = (params, urlParams) => {
  return http.delete(api.deleteRoleUser, params, urlParams)
}

export const revokeRoleToUsers = (params, urlParams) => {
  return http.delete(api.revokeRoleToUsers, params, urlParams)
}

// 系统设置

export const queryAllConfig = (params, pagination) => {
  return http.getPage(api.queryAllConfig, params, null, pagination)
}
export const addConfig = params => {
  return http.post(api.addConfig, params)
}
export const updateConfig = (params, urlParams) => {
  return http.put(api.updateConfig, params, urlParams)
}
export const deleteConfig = (params, urlParams) => {
  return http.delete(api.deleteConfig, params, urlParams)
}
export const getConfigById = (params, urlParams) => {
  return http.get(api.getConfigById, params, urlParams)
}
// ip管理
export const queryAllIpsPage = (params, pagination) => {
  return http.getPage(api.queryAllIps, params, null, pagination)
}

export const getIpsById = (params, urlParams) => {
  return http.get(api.getIpsById, params, urlParams)
}

export const addIps = params => {
  return http.post(api.addIps, params)
}
export const updateIps = (params, urlParams) => {
  return http.put(api.updateIps, params, urlParams)
}
export const deleteIps = (params, urlParams) => {
  return http.delete(api.deleteIps, params, urlParams)
}
// 行政区域
export const queryAllSysGlobalAreaPage = (params, pagination) => {
  return http.getPage(api.queryAllSysGlobalArea, params, null, pagination)
}
// 字典组管理
export const queryAllDictGroup = (params, pagination) => {
  return http.getPage(api.queryAllDictGroup, params, null, pagination)
}

export const addDictGroup = (params, urlParams) => {
  return http.post(api.addDictGroup, params, urlParams)
}

export const deleteDictGroup = (params, urlParams) => {
  return http.delete(api.deleteDictGroup, params, urlParams)
}
export const updateDictGroup = (params, urlParams) => {
  return http.put(api.updateDictGroup, params, urlParams)
}

export const getDictGroupById = params => {
  return http.post(api.getDictGroupById, params)
}
// 字典项管理
export const queryAllDictItem = (params, pagination) => {
  return http.getPage(api.queryAllDictItem, params, null, pagination)
}

export const addDictItem = (params, urlParams) => {
  return http.post(api.addDictItem, params, urlParams)
}

export const deleteDictItem = (params, urlParams) => {
  return http.delete(api.deleteDictItem, params, urlParams)
}
export const updateDictItem = (params, urlParams) => {
  return http.put(api.updateDictItem, params, urlParams)
}
// 职位组
export const getPositionGroupTree = params => {
  return http.get(api.getPositionGroupTree, params)
}
export const addPositionGroup = params => {
  return http.post(api.addPositionGroup, params)
}
export const deletePositionGroup = (params, urlParams) => {
  return http.delete(api.deletePositionGroup, params, urlParams)
}
export const updatePositionGroup = params => {
  return http.post(api.updatePositionGroup, params)
}

// 职位
export const addPosition = params => {
  return http.post(api.addPosition, params)
}
export const deletePosition = (params, urlParams) => {
  return http.delete(api.deletePosition, params, urlParams)
}
export const updatePosition = (params, urlParams) => {
  return http.put(api.updatePosition, params, urlParams)
}

export const getPostioniTree = params => {
  return http.get(api.getPostioniTree, params)
}

export const addPositionGroups = params => {
  return http.post(api.addPositionGroup, params)
}

export const updatePositionGroups = (params, urlParams) => {
  return http.put(api.updatePositionGroup, params, urlParams)
}

export const deletePositionUserByBatches = params => {
  return http.post(api.deletePositionUserByBatches, params)
}

export const setManager = params => {
  return http.post(api.setManager, params)
}

export const getPositionUserJoinList = (params, urlParams) => {
  return http.get(api.getPositionUserJoinList, params, urlParams)
}

export const savePostion = params => {
  return http.post(api.savePostion, params)
}

export const getPostionList = params => {
  return http.get(api.getPostionList, params)
}

export const deletePositionUser = params => {
  return http.delete(api.deletePositionUser, params)
}

// 部门，组织架构

export const getOrganizationTree = params => {
  return http.get(api.getOrganizationTree, params)
}
export const getOrganList = (params, urlParams) => {
  return http.get(api.getOrganList, params, urlParams)
}
export const getUserList = params => {
  return http.get(api.getUserList, params)
}
export const addOrganization = (params, customConfig) => {
  return http.post(api.addOrganization, params, null, customConfig)
}
export const deleteOrganization = (params, urlParams) => {
  return http.delete(api.deleteOrganization, params, urlParams)
}

export const updateOrganization = (params, urlParams) => {
  return http.put(api.updateOrganization, params, urlParams)
}
export const deleteOrganizationUserByBatches = params => {
  return http.delete(api.deleteOrganizationUserByBatches, params)
}
export const selectOrganizationByUserId = (params, urlParams) => {
  return http.get(api.selectOrgByUserId, params, urlParams)
}

// 租户管理
export const queryAllTenants = params => {
  return http.get(api.queryAllTenants, params)
}
export const queryTenantsPage = (params, pagination) => {
  return http.getPage(api.queryAllTenants, params, null, pagination)
}
export const addTenants = params => {
  return http.post(api.addTenants, params)
}
export const updateTenantsAuth = (params, urlParams) => {
  return http.post(api.updateTenantsAuth, params, urlParams)
}
export const queryTenantInfoById = id => {
  return http.get(api.queryTenantInfoById + id)
}
export const getTenantAllAuth = (params, urlParams) => {
  return http.get(api.getTenantAllAuth, params, urlParams)
}
export const startTenant = (params, urlParams) => {
  return http.post(api.startTenant, params, urlParams)
}
export const stopTenant = (params, urlParams) => {
  return http.post(api.stopTenant, params, urlParams)
}
export const updateTenant = (params, urlParams) => {
  return http.put(api.updateTenant, params, urlParams)
}
export const queryCurrentAuth = (params, urlParams) => {
  return http.get(api.queryCurrentAuth, params, urlParams)
}

export const updateTenantPwd = params => {
  return http.post(api.updateTenantPwd, params)
}

// 授予租户
export const queryTenantPowerList = (params, urlParams) => {
  return http.get(api.queryTenantPowerList, params, urlParams)
}
export const deleteTenantPower = (params, urlParams) => {
  return http.delete(api.deleteTenantPower, params, urlParams)
}
export const addTenantPower = (params, urlParams) => {
  return http.post(api.addTenantPower, params, urlParams)
}
/**
 * 保存部门用户关系
 * @param params
 * @returns {*}
 */
export const saveOrganUserRelative = params => {
  return http.post(api.saveOrganUserRelative, params)
}

// --日志管理
export const getAllSysLog = (params, pagination) => {
  return http.getPage(api.getAllSysLogList, params, null, pagination)
}

export const updatePassWord = params => {
  return http.post(api.updatePassWord, params)
}

export const updateExpirePassword = params => {
  return http.post(api.updateExpirePassword, params)
}

// 请假demo
export const queryAllLeave = params => {
  return http.get(api.queryAllLeave, params)
}
export const addLeave = params => {
  return http.post(api.addLeave, params)
}
export const updateLeave = (params, urlParams) => {
  return http.put(api.updateLeave, params, urlParams)
}
export const deleteLeave = (params, urlParams) => {
  return http.delete(api.deleteLeave, params, urlParams)
}
export const startLeave = (params, urlParams) => {
  return http.post(api.startLeave, params, urlParams)
}
export const getLeavesByProInstId = (params, urlParams) => {
  return http.get(api.getLeavesByProInstId, params, urlParams)
}
export const completeLeave = (params, urlParams) => {
  return http.post(api.completeLeave, params, urlParams)
}
export const getToDoTaskPageList = params => {
  return http.get(api.getToDoTaskPageList, params)
}
export const getInstanceImage = params => {
  return http.get(api.getInstanceImage, params)
}
export const getApprovalHistoryList = params => {
  return http.get(api.getApprovalHistoryList, params)
}

// demo-员工统计-查询部门列表
export const getFirstLevelOrgList = () => {
  return http.get(api.getFirstLevelOrgList)
}

// demo-员工统计-图表数据查询
export const getStaffStatisticsChartData = params => {
  return http.get(api.getStaffStatisticsChartData, params)
}

// --资源管理
export const queryAllSysFile = (params, pagination) => {
  return http.getPage(api.queryAllSysFileList, params, null, pagination)
}

export const updateFile = (params, urlParams) => {
  return http.put(api.updateSysFile, params, urlParams)
}

export const downloadSysFile = (params, urlParams) => {
  return http.get(api.downloadSysFile, params, urlParams, null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export const uploadSysFile = params => {
  return http.post(api.uploadSysFile, params, null, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 系统服务运行实例管理
export const queryAllSysGlobalInstance = (params, pagination) => {
  return http.getPage(api.queryAllSysGlobalInstance, params, null, pagination)
}
export const deleteSysGlobalInstance = (params, urlParams) => {
  return http.delete(api.deleteSysGlobalInstance, params, urlParams)
}
export const updateSysGlobalInstance = (params, urlParams) => {
  return http.put(api.updateSysGlobalInstance, params, urlParams)
}
export const addSysGlobalInstance = params => {
  return http.post(api.addSysGlobalInstance, params)
}
export const getSysGlobalInstanceById = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceById, params, urlParams)
}

// 系统运行实例 监控数据
export const getSysGlobalInstanceDruid = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceDruid, params, urlParams)
}
export const getSysGlobalInstanceRedis = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceRedis, params, urlParams)
}
export const getSysGlobalInstanceHealth = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceHealth, params, urlParams)
}
export const getSysGlobalInstanceMetrics = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceMetrics, params, urlParams)
}
export const getSysGlobalInstanceMetricsByName = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceMetricsByName, params, urlParams)
}
export const getSysGlobalInstanceCaches = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceCaches, params, urlParams)
}
export const getSysGlobalInstanceEnv = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceEnv, params, urlParams)
}
export const getSysGlobalInstanceEnvByProp = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceEnvByProp, params, urlParams)
}
export const getSysGlobalInstanceScheduler = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceScheduler, params, urlParams)
}
export const getSysGlobalInstanceThreadDump = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceThreadDump, params, urlParams)
}
export const getSysGlobalInstanceLoggers = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceLoggers, params, urlParams)
}
export const getSysGlobalInstanceLoggersByName = (params, urlParams) => {
  return http.get(api.getSysGlobalInstanceLoggersByName, params, urlParams)
}

export {
  getAllUser,
  getUserPage,
  addUser,
  updateUser,
  getUserAuthById,
  addAuth,
  deleteAuth,
  getAllAuthTree,
  getAllMenu,
  getAuthById,
  editAuthById,
  getUserInfoById,
  updateUserAuth,
  getUserAllAuth,
  getAllAuthUsers,
  grantAuthToUsers,
  revokeAuthToUsers,
  getAllAuthRoles,
  grantAuthToRoles,
  revokeAuthToRoles,
  getTenantPage
}
