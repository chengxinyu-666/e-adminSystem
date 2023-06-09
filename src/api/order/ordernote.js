import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-order/tordernote/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getPage = (current, size, params) => {
  return request({
    url: '/api/blade-order/tordernote/page',
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
    url: '/api/blade-order/tordernote/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-order/tordernote/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-order/tordernote/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-order/tordernote/submit',
    method: 'post',
    data: row
  })
}

