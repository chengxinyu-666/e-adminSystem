import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-audit/ordercollectionrecord/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getWaitingCollectionList = (current, size, params) => {
  return request({
    url: '/api/blade-audit/ordercollectionrecord/waitingCollection/list',
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
    url: '/api/blade-audit/ordercollectionrecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-audit/ordercollectionrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-audit/ordercollectionrecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-audit/ordercollectionrecord/submit',
    method: 'post',
    data: row
  })
}

