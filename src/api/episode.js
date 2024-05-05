import request from "@/utils/request";

export function addEposide(data) {
  return request({
    url: "/Listening.Admin/Episode/Add",
    method: "post",
    data,
  });
}

export function updateEposide(data) {
  return request({
    url: `/Listening.Admin/Episode/Update/${data.id}`,
    method: "put",
    data,
  });
}

export function deleteEposide(id) {
  return request({
    url: `/Listening.Admin/Episode/DeleteById/${id}`,
    method: "delete",
  });
}

export function findEposideAlbumId(id) {
  return request({
    url: `/Listening.Admin/Episode/FindByAlbumId/${id}`,
    method: "get",
  });
}

export function findEncodingEpisodesByAlbumId(id) {
  return request({
    url: `/Listening.Admin/Episode/findEncodingEpisodesByAlbumId/${id}`,
    method: "get",
  });
}

export function hideEpisode(id) {
  return request({
    url: `/Listening.Admin/Episode/Hide/${id}`,
    method: "put",
  });
}

export function showEpisode(id) {
  return request({
    url: `/Listening.Admin/Episode/Show/${id}`,
    method: "put",
  });
}
