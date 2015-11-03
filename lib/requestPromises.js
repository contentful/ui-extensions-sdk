function RequestPromises () {
  this.promises = {}
}

RequestPromises.prototype.push = function (promiseId, resolve, reject) {
  this.promises[promiseId] = {
    resolve: resolve,
    reject: reject
  }
}

RequestPromises.prototype.pop = function (promiseId) {
  var promise = this.promises[promiseId]
  delete this.promises[promiseId]
  return promise
}

module.exports = {
  create: function () {
    this.requestPromises = new RequestPromises()
    return this.requestPromises
  },

  get: function () {
    return this.requestPromises
  }
}
