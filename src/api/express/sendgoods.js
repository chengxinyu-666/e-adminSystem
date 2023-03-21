import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-express/sendgoods/list',
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
    url: '/api/blade-express/sendgoods/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const todayCount = () => {
  return request({
    url: '/api/blade-express/sendgoods/todayCount',
    method: 'get',
    params: {}
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-express/sendgoods/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-express/sendgoods/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-express/sendgoods/update',
    method: 'post',
    data: row
  })
}

