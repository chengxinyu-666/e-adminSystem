import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const temps = (params) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/temps',
    method: 'get',
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/set-parameter/entryformtemplate/submit',
    method: 'post',
    data: row
  })
}

