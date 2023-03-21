import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-operation/rentinfo/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getAllList = () => {
  return request({
    url: '/api/blade-operation/rentinfo/select',
    method: 'get'
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-operation/rentinfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-operation/rentinfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-operation/rentinfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-operation/rentinfo/submit',
    method: 'post',
    data: row
  })
}

