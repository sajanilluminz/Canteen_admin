import {baseUrl} from '~utils/constants/baseurl';

class CanteenEndPoints {
  login = baseUrl + '/api/v1/users/admin/login';
  getAllProducts = baseUrl + '/api/v1/items/getItem';
  getCategories = baseUrl + '/api/v1/category/getCategories';
  uploadImage = baseUrl + '/api/v1/items/upload';
  createProduct = baseUrl + '/api/v1/items/create';
  deleteProduct = baseUrl + '/api/v1/items/deleteItem';
  enableDisableProduct = baseUrl + '/api/v1/items/itemEnableDisable';
  updateProduct = baseUrl + '/api/v1/items/updateItem';
  getUsers = baseUrl + '/api/v1/users/admin/userlisting';
  patchAmount = baseUrl + '/api/v1/order/amountCalculations';
  logout = baseUrl + '/api/v1/users/admin/logout';
  suggestions =
    baseUrl + '/api/v1/suggested-product/getSuggestedProduct?type=0';
  suggestionsHistory =
    baseUrl + '/api/v1/suggested-product/getSuggestedProduct';
  acceptOrRejectSuggestion =
    baseUrl + '/api/v1/suggested-product/productStatusChange';
  deleteUser = baseUrl + '/api/v1/users/admin/delete';
}

export default new CanteenEndPoints();
