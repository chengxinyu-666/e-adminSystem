import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-order/orderbill/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const overdueList = (orderId,billId) => {
  return request({
    url: '/api/blade-order/orderbill/overdueList',
    method: 'get',
    params: {
      orderId,
      billId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/blade-order/orderbill/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/blade-order/orderbill/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/blade-order/orderbill/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/blade-order/orderbill/submit',
    method: 'post',
    data: row
  })
}

export const deductMoney = (row) => {
  return request({
    url: '/api/blade-order/orderbill/deduct/money',
    method: 'post',
    data: row
  })
}

