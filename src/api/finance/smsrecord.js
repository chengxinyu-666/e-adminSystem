import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/finance_manage/smsrecord/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const orderSms = (id) => {
  return request({
    url: '/api/finance_manage/smsrecord/orderSms',
    method: 'get',
    params: {
      orderId:id
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/finance_manage/smsrecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/finance_manage/smsrecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/finance_manage/smsrecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/finance_manage/smsrecord/submit',
    method: 'post',
    data: row
  })
}

