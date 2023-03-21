import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getcanUserList = (current, size, params) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/canSends',
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
    url: '/api/set-parameter/buyunsmstemplate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const send = (params) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/send',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/set-parameter/buyunsmstemplate/submit',
    method: 'post',
    data: row
  })
}

