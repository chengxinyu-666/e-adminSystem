import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-operation/maintaininfo/list',
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
    url: '/api/blade-operation/maintaininfo/select',
    method: 'get'
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-operation/maintaininfo/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-operation/maintaininfo/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-operation/maintaininfo/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-operation/maintaininfo/submit',
    method: 'post',
    data: row
  })
}

