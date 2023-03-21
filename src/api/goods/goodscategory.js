import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-goods/goodscategory/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const categoryTree = () => {
  return request({
    url: '/api/blade-goods/goodscategory/tree',
    method: 'get'
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-goods/goodscategory/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-goods/goodscategory/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-goods/goodscategory/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-goods/goodscategory/submit',
    method: 'post',
    data: row
  })
}

