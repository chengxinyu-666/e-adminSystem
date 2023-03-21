import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-order/order/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-order/order/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-order/order/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}
/**
 * 审核通过
 * @param orderId
 * @returns {*}
 */
export const audit = (orderId,examineId) => {
  return request({
    url: '/api/blade-order/order/audit',
    method: 'post',
    params: {
      orderId,
      examineId
    }
  })
}

/**
 * 审核拒绝
 * @param orderId
 * @returns {*}
 */
export const refused = ({orderId,examineId,note}) => {
  return request({
    url: '/api/blade-order/order/refused',
    method: 'post',
    params: {
      orderId,
      examineId,
      note
    }
  })
}

/**
 * 买断审核通过
 * @param orderId
 * @returns {*}
 */
export const auditBuyout = (orderId,examineId) => {
  return request({
    url: '/api/blade-order/order/auditBuyout',
    method: 'post',
    params: {
      orderId
    }
  })
}

/**
 * 归还审核通过
 * @param orderId
 * @returns {*}
 */
export const auditReturn = (orderId,examineId) => {
  return request({
    url: '/api/blade-order/order/auditReturn',
    method: 'post',
    params: {
      orderId
    }
  })
}

/**
 * 归还审核拒绝
 * @param orderId
 * @returns {*}
 */
export const returnRefused = (orderId,examineId) => {
  return request({
    url: '/api/blade-order/order/returnRefused',
    method: 'post',
    params: {
      orderId
    }
  })
}

/**
 * 买断审核拒绝
 * @param orderId
 * @returns {*}
 */
export const buyoutRefused = (orderId,examineId) => {
  return request({
    url: '/api/blade-order/order/buyoutRefused',
    method: 'post',
    params: {
      orderId
    }
  })
}


export const add = (row) => {
  return request({
    url: '/api/blade-order/order/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-order/order/update',
    method: 'post',
    data: row
  })
}

export const entryForm = (row) => {
  return request({
    url: '/api/blade-order/order/entryForm',
    method: 'post',
    data: row
  })
}

export const expressList = (orderId) => {
  return request({
    url: '/api/blade-order/order/expressList',
    method: 'Post',
    params: {
      orderId
    }
  })
}

export const allotTenant = (ids,tenantId) => {
  return request({
    url: '/api/blade-order/order/allot/tenant',
    method: 'post',
    params: {
      ids,
      tenantId
    }
  })
}

export const cancle = (orderId) => {
  return request({
    url: '/api/blade-order/order/cancle',
    method: 'Post',
    params: {
      orderId
    }
  })
}

export const download = (contractNo) => {
  return request({
    url: '/api/blade-order/order/download',
    method: 'get',
    params: {
      contractNo
    }
  })
}

/**
 * 撤换按钮
 * @param orderId
 * @param typeId
 * @param status
 * @returns {*}
 */
export const changeBt = (orderId,typeId,status) => {
  return request({
    url: '/api/blade-order/order/changeBt',
    method: 'post',
    params: {
      orderId,
      typeId,
      status
    }
  })
}

export const settlement = (data) => {
  return request({
    url: '/api/blade-order/order/settlement',
    method: 'post',
    data: data
  })
}

export const received = (orderId,clientId) => {
  return request({
    url: '/api/blade-order/order/received',
    method: 'post',
    params: {
      orderId,
      clientId
    }
  })
}

export const homeStatistics = () => {
  return request({
    url: '/api/blade-order/order/homeStatistics',
    method: 'get',
    params: {}
  })
}
