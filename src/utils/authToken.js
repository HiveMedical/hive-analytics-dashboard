export default {
  getToken: function(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken;
  },
  setToken: function(token, userinfo){
    sessionStorage.setItem('token', JSON.stringify(token));
    sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
  },
  clearToken: function(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userinfo');
  },
  getUserinfo: function(){
    const userinfo = sessionStorage.getItem('userinfo');
    return JSON.parse(userinfo);
  }
};
