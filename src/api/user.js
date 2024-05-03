import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/IdentityService/Login/LoginByUserNameAndPwd",
    method: "post",
    data,
  });
}

export function getInfo() {
  return request({
    url: "/IdentityService/Login/GetUserInfo",
    method: "get",
    // params: { token },
  });
}

export function logout() {
  return request({
    url: "/vue-admin-template/user/logout",
    method: "post",
  });
}
