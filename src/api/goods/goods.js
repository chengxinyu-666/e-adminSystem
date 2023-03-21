import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-goods/goods/page',
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
    url: '/api/blade-goods/goods/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-goods/goods/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-goods/goods/submit',
    method: 'post',
    data: row
  })
}

export const saveOrUpdate = (row) => {
  return request({
    url: '/api/blade-goods/goods/saveOrUpdate',
    method: 'post',
    data: row
  })
}


export const tabs = () => {
  return request({
    url: '/api/blade-goods/goods/tabs',
    method: 'get'
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-goods/goods/submit',
    method: 'post',
    data: row
  })
}

