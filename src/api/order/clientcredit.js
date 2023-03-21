import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-order/clientcredit/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id, isNew) => {
  return request({
    url: '/api/blade-order/clientcredit/detail',
    method: 'get',
    params: {
      id,
      isNew
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-order/clientcredit/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-order/clientcredit/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-order/clientcredit/submit',
    method: 'post',
    data: row
  })
}

