import request from '@/utils/request';

export async function getDateList() {
  return request('/api/getDateList');
}
export async function getGoodsTypeList() {
  return request('/api/getGoodsTypeList');
}
export async function getDataList({ params } = {}) {
  return request('/api/getData', { params });
}
export async function importData(date, goodsType, isClean) {
  return request(`/api/import?date=${date}&goodsType=${goodsType}&isClean=${isClean}`);
}
export async function deleteData({ params } = {}) {
  return request('/api/delete', { params });
}
export async function cleanData() {
  return request('/api/clean');
}
export async function uploadData(formData) {
  return request('/api/upload', {
    method: 'post',
    data: formData,
  });
}
export async function importAllData() {
  return request('api/importAll');
}
