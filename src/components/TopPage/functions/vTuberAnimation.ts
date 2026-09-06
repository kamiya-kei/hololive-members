// VTuberアイコンの揺れアニメーションを画面内でだけ動かすための共通処理。
// 画面外では止めて描画負荷を下げるが、再開時に共通の起点からの位相へ合わせるので動きはズレない。

const ANIMATION_DURATION_MS = 800; // VTuberCircle.vue の myrotate と揃える
const ANIMATION_EPOCH = performance.now();

const callbacks = new WeakMap<Element, (isVisible: boolean) => void>();
let observer: IntersectionObserver | null = null;

// VTuberの数だけIntersectionObserverを作らないよう1つを使い回す
const getObserver = (): IntersectionObserver => {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => callbacks.get(entry.target)?.(entry.isIntersecting));
      },
      { rootMargin: '300px' } // 画面に入る少し手前で動き出す
    );
  }
  return observer;
};

// 要素が画面内にあるかを監視する。戻り値を呼ぶと監視を解除する
export const observeIsVisible = (el: Element, onChange: (isVisible: boolean) => void) => {
  callbacks.set(el, onChange);
  getObserver().observe(el);
  return () => {
    getObserver().unobserve(el);
    callbacks.delete(el);
  };
};

// 動き続けているVTuberと位相を揃えるための負のanimation-delay
export const currentAnimationDelay = (): string =>
  `-${(performance.now() - ANIMATION_EPOCH) % ANIMATION_DURATION_MS}ms`;
