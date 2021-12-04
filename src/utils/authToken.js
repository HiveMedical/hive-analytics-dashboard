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
  },
  storePatientlist_key: function(patient_list){
    var patient_list_with_id_key = {};
    patient_list.forEach((element) => {
      patient_list_with_id_key[element.User_ID] = element;
    });
    sessionStorage.setItem('patient_list_key', JSON.stringify(patient_list_with_id_key));
  },
  storePatientlist: function(patient_list){
    sessionStorage.setItem('patient_list', JSON.stringify(patient_list));
  },
  getPatientlist_key: function(){
    const info = sessionStorage.getItem('patient_list_key');
    return JSON.parse(info);
  },
  getPatientlist: function(){
    const info = sessionStorage.getItem('patient_list');
    return JSON.parse(info);
  }
};
