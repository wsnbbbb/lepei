// 七牛云组件优化,在main.js注册成vue方法后直接全局使用 imgBase(xxx.png)方法即可
exports.install = function(Vue, path) {
  Vue.prototype.imgBase = function(path) {
    return 'http://test.qiniu.lepayedu.com/' + path
  }
}
