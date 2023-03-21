import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-order/clientrisk/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id,isNew) => {
  return request({
    url: '/api/blade-order/clientrisk/detail',
    method: 'get',
    params: {
      id,
      isNew
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-order/clientrisk/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-order/clientrisk/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-order/clientrisk/submit',
    method: 'post',
    data: row
  })
}

