import request from "@/utils/request";

export function getAlbums(categoryId) {
  return request({
    url: `/Listening.Admin/Album/FindByCategoryId/${categoryId}`,
    method: "get",
  });
}

export function deleteAlbum(id) {
  return request({
    url: `/Listening.Admin/Album/DeleteById/${id}`,
    method: "delete",
  });
}

export function showAlbum(id) {
  return request({
    url: `/Listening.Admin/Album/Show/${id}`,
    method: "put",
  });
}

export function hideAlbum(id) {
  return request({
    url: `/Listening.Admin/Album/Hide/${id}`,
    method: "put",
  });
}

export function addAlbum(data) {
  return request({
    url: "/Listening.Admin/Album/Add",
    method: "post",
    data,
  });
}

export function updateAlbum(data) {
  return request({
    url: `/Listening.Admin/Album/Update/${data.id}`,
    method: "put",
    data,
  });
}
