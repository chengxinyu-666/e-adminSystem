import request from '@/router/axios';

export const getNoExamineList = (current, size, params) => {
  return request({
    url: '/api/blade-audit/orderexamine/noExamine/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getWaitingExamineList = (current, size, params) => {
  return request({
    url: '/api/blade-audit/orderexamine/waitingExamine/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const getAuditorUserList = ( params) => {
  return request({
    url: '/api/blade-audit/orderexamine/auditorList',
    method: 'get',
    params: {
      ...params,
    }
  })
}


export const takeAuditTask = ( limit ) => {
  return request({
    url: '/api/blade-audit/orderexamine/takeTask',
    method: 'get',
    params: {
      limit:limit
    }
  })
}


export const taskNumber = ( ) => {
  return request({
    url: '/api/blade-audit/orderexamine/taskNumber',
    method: 'get',
    params: {}
  })
}


export const add = (row) => {
  return request({
    url: '/api/blade-audit/orderexamine/submit',
    method: 'post',
    data: row
  })
}

export const distribute = ( params) => {
  return request({
    url: '/api/blade-audit/orderexamine/distribute',
    method: 'post',
    params: {
      ...params,
    }
  })
}
