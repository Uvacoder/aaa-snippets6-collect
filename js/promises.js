/**
 * @template T
 * @param {Promise<T>} original the original Promise to wrap with the timeout
 * @param {number} ms milliseconds to wait before rejecting due to timeout
 * @param {string} [error] optional custom timeout message
 * @returns {Promise<T>}
 */
function timeout(original, ms, error = `timed out after ${ms}ms`) {
  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => reject(new Error(error)), ms);

    original
      .then((resolvedValue) => resolve(resolvedValue))
      .catch((error) => reject(error))
      .finally(() => clearTimeout(timerId));
  });
}

function deferred() {
  let res, rej

  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  promise.resolve = res
  promise.reject = rej

  return promise
}

class LazyPromise extends Promise {
  constructor(fn) {
      super(()=>{});
    if (typeof fn !== 'function') {
      throw new TypeError('A function should be used for constructor');
    }
    this._fn = fn;
  }

  then() {
    const promise = new Promise(this._fn);
    return promise.then.apply(promise, arguments);
  }
}
