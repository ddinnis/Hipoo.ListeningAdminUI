import request from "@/utils/request";

export function getCategories() {
  return request({
    url: "/Listening.Admin/Category/FindAll",
    method: "get",
  });
}

export function addCategory(data) {
  return request({
    url: "/Listening.Admin/Category/Add",
    method: "post",
    data,
  });
}

export function updateCategory(data) {
  return request({
    url: `/Listening.Admin/Category/Update/${data.id}`,
    method: "put",
    data,
  });
}

export function deleteCategory(id) {
  return request({
    url: `/Listening.Admin/Category/DeleteById/${id}`,
    method: "delete",
  });
}
