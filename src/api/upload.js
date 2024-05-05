import request from "@/utils/request";

export function uploadFile(formData, config) {
  return request({
    url: "/FileService/Upload/UploadFile",
    method: "post",
    data: formData,
    ...config,
  });
}

// `${apiRoot}/FileService/Upload/FileExist?fileSize=${fileSize}&sha256Hash=${hash}`
export function isFileExist(fileSize, hash) {
  return request({
    url: `/FileService/Upload/FileExist?fileSize=${fileSize}&sha256Hash=${hash}`,
    method: "get",
  });
}
