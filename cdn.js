/**
 * 不要删除，nodeServer使用
 */
var path = require("path")
var fs = require("fs")

module.exports = function(){
  function readJsonFile(path) {
    return JSON.parse(readStrFile(path));
  }
  function readStrFile(path) {
    return fs.readFileSync(path,{
      charset:'utf-8'
    }).toString();
  }
}()

