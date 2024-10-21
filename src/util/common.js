export function debounce(fn, timerDelay = 500, immediate = true) {
  let timer;
  return function () {
    let that = this;
    let args = arguments;

    if (timer) clearTimeout(timer);
    if (immediate) {
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, timerDelay)
      if (callNow) fn.apply(that, args)
    }
    else {
      timer = setTimeout(function () {
        fn.apply(that, args)
      }, timerDelay);
    }
  }
}

export function jumpUrl(url) {
  const timer = setTimeout(() => {
    console.log(url);
    clearTimeout(timer)
    window.open(url, '_blank')
  }, 100)

  // const anchorEle = document.createElement('a')
  // anchorEle.href = url
  // anchorEle.target = '_blank'
  // anchorEle.click()
}
