(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vueRouterAuthority = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var VueRouterGuard = function () {
  function VueRouterGuard() {
    classCallCheck(this, VueRouterGuard);
  }

  createClass(VueRouterGuard, [{
    key: 'RouterAuthority',
    value: function RouterAuthority(to, from, next) {
      var pageOperations = store.state.login.pageOperations;


      if (to.path === '/' || to.path === '/welcome') {
        toggleLoading();
        next();
        return;
      }

      if (pageOperations.length === 0) {
        if (from.name !== null) {
          toggleLoading();
          next('/welcome');
          return;
        } else {
          // 刷新页面，这时还没获得权限内容，需要在这里手动调权限接口来获得
          loginApi.getOperation().then(function (response) {
            var code = response.code,
                data = response.data;

            if (code === '00000') {
              pageOperations = data.pageOperations;
              toggleLoading();
              routerHandler(to, from, next, pageOperations);
            } else {
              pageOperations = [];
              toggleLoading();
              next();
            }
          });
        }
      } else {
        routerHandler(to, from, next, pageOperations);
      }
    }
  }]);
  return VueRouterGuard;
}();

function routerHandler(to, from, next, pageOperations) {
  var hasAccess = false;
  pageOperations.forEach(function (v) {
    if (v === to.name) {
      hasAccess = true;
    }
  });

  if (hasAccess) {
    next();
  } else {
    Message.info({
      message: '没有权限'
    });
    if (from.name) {
      next(from.path);
    } else {
      next('/welcome');
    }
  }
}

return VueRouterGuard;

})));
//# sourceMappingURL=bundle.js.map
