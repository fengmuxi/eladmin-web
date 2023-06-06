import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/userKami',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/userKami/',
    method: 'delete',
    data: ids
  })
}

export function delExpirationKaMi() {
  return request({
    url: 'api/userKami/delExpirationKaMi',
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/userKami',
    method: 'put',
    data
  })
}

export default { add, edit, del, delExpirationKaMi }
