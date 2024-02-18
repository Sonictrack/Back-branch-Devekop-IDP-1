import Vue from 'vue'

Vue.filter("dateFormat", function(value) {
  if (value) {
    const dt = new Date(value);
    return dt.toLocaleString();
  } else return "";
});