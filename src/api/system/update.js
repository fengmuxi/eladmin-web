import request from '@/utils/request'

export function getVersions() {
  return request({
    url: '/api/update/versions',
    method: 'get'
  })
}

export function getPagingVersions(data) {
  return request({
    url: '/api/update/versionPageQuery',
    method: 'post',
    data
  })
}

export function addVersionInfo(data) {
  return request({
    url: '/api/update/newVersion',
    method: 'post',
    data
  })
}

export function uploadApkFile(formData) {
  return request({
    url: '/api/update/uploadApk',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteVersion(data) {
  return request({
    url: '/api/update/delete',
    method: 'post',
    data
  })
}

export function updateVersion(data) {
  return request({
    url: '/api/update/updateInfo',
    method: 'post',
    data
  })
}
