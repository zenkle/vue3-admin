type ResizeOptions = {
  w?: number;
  h?: number;
  fullScreen?: boolean;
  delay?: number;
};

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export const useResize = (options: ResizeOptions = {}) => {
  const width = 1920;
  const height = 1080;
  const { w = width, h = height, fullScreen = false, delay = 100 } = options;
  const screenRef = ref<HTMLDivElement | null>(null);
  const scale = ref<number>(1);

  let resizeHandler: (() => void) | null = null;
  const resize = () => {
    if (!screenRef.value) return;

    const wScale = document.body.clientWidth / w;
    const hScale = document.body.clientHeight / h;

    if (fullScreen) {
      // 如果不在乎缩放失真的情况，可以设置全屏
      screenRef.value.style.transform = `scale(${wScale}, ${hScale})`;
    } else {
      // 如果在乎缩放失真的情况，不建议设置全屏
      scale.value = Math.min(wScale, hScale);

      screenRef.value.style.transform = "scale(" + scale.value + ")";
    }
  };

  onMounted(() => {
    resizeHandler = debounce(resize, delay);
    resize();
    window.addEventListener("resize", resizeHandler);
  });
  onBeforeUnmount(() => {
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
      resizeHandler = null;
    }
  });

  return {
    screenRef,
  };
};
