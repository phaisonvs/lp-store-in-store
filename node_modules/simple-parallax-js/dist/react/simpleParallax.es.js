import E, { useState as a, useRef as M, useCallback as L, useEffect as u } from "react";
class p {
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.animationFrameId = null;
  }
  static getInstance() {
    return p.instance || (p.instance = new p()), p.instance;
  }
  register(t) {
    this.callbacks.add(t), this.animationFrameId === null && this.start();
  }
  unregister(t) {
    this.callbacks.delete(t), this.callbacks.size === 0 && this.animationFrameId !== null && this.stop();
  }
  start() {
    const t = () => {
      this.callbacks.forEach((n) => n()), this.animationFrameId = requestAnimationFrame(t);
    };
    this.animationFrameId = requestAnimationFrame(t);
  }
  stop() {
    this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
}
const H = p.getInstance(), B = (e) => {
  const [t, n] = a(0), [r, i] = a(!1), o = M(null), s = L(() => {
    o.current && n(o.current.height);
  }, []);
  return u(() => {
    const d = () => {
      i(!0), s();
    }, c = o.current;
    return c && (c.complete ? d() : c.addEventListener("load", d)), window.addEventListener("resize", s), () => {
      c && c.removeEventListener("load", d), window.removeEventListener("resize", s);
    };
  }, [e, s]), [o, t, r];
}, G = (e, t) => e * t - e, O = (e, t) => Math.ceil(e / 100 * t - t / 2), W = (e, t) => {
  const { top: n, height: r } = e, i = -r, o = t;
  if (n < i)
    return 0;
  if (n > o)
    return 100;
  const s = (n - i) / (o - i) * 100;
  return Math.min(Math.max(s, 0), 100);
}, Y = (e, t) => {
  switch (t) {
    case "up":
      return `0, ${e}px, 0`;
    case "right":
      return `${-e}px, 0, 0`;
    case "down":
      return `0, ${-e}px, 0`;
    case "left":
      return `${e}px, 0, 0`;
    case "up left":
      return `${e}px, ${e}px, 0`;
    case "up right":
      return `${-e}px, ${e}px, 0`;
    case "down left":
      return `${e}px, ${-e}px, 0`;
    case "down right":
      return `${-e}px, ${-e}px, 0`;
    default:
      return `0, ${e}px, 0`;
  }
}, D = () => {
  const [e, t] = a(null);
  return u(() => {
    const n = () => {
      t(window.innerHeight);
    };
    if (typeof window < "u")
      return t(window.innerHeight), window.addEventListener("resize", n), () => {
        window.removeEventListener("resize", n);
      };
  }, []), e;
}, Q = ({
  isLoaded: e,
  imageHeight: t,
  scale: n,
  boundingClientRect: r,
  orientation: i,
  maxTransition: o
}) => {
  const [s, d] = a(0), [c, x] = a(0), [g, b] = a(""), [h, I] = a(0), w = D();
  return u(() => {
    if (!e)
      return;
    const l = G(t, n);
    d(l);
  }, [e, t, n]), u(() => {
    if (!e || !w || !r)
      return;
    let l = W(r, w);
    o && (l = Math.min(l, 100 - o)), I(l);
  }, [e, r, w]), u(() => {
    const l = O(h, s);
    x(l);
  }, [h, s]), u(() => {
    const l = Y(c, i);
    b(l);
  }, [c, i]), g;
}, U = (e = {}) => {
  const [t, n] = a(!1), r = M(null);
  return u(() => {
    const i = new IntersectionObserver(
      (s) => {
        const [d] = s;
        d && (d.isIntersecting ? n(!0) : n(!1));
      },
      {
        ...e
      }
    ), { current: o } = r;
    return o && i.observe(o), () => {
      o && i.unobserve(o);
    };
  }, [e]), [r, t];
}, _ = () => {
  const [e, t] = a(!1);
  return u(() => {
    if (typeof window > "u")
      return;
    const n = window.matchMedia("(prefers-reduced-motion: reduce)");
    t(n.matches);
    const r = (i) => {
      t(i.matches);
    };
    return n.addEventListener("change", r), () => {
      n.removeEventListener("change", r);
    };
  }, []), e;
};
var J = "/Users/geoffrey/Desktop/perso/simpleParallax.js/src/react/index.tsx";
const X = ({
  delay: e = 0.4,
  orientation: t = "up",
  scale: n = 1.4,
  overflow: r = !1,
  transition: i = "cubic-bezier(0,0,0,1)",
  maxTransition: o = null,
  children: s
}) => {
  var T;
  const d = t ?? "up", c = n ?? 1.2, x = (T = s == null ? void 0 : s.props) == null ? void 0 : T.src, [g, b] = a(!1), [h, I] = a(0), [w, l] = a(null), [P, V] = a(""), [k, v] = a(""), [y, z] = a(!1), f = _(), [$, A, N] = B(x), [j, F] = U({
    root: null,
    rootMargin: "0px",
    threshold: Array.from(Array(101).keys(), (m) => m / 100)
  }), S = Q({
    isLoaded: N,
    imageHeight: A,
    scale: c,
    boundingClientRect: w,
    orientation: d,
    maxTransition: o
  }), R = L(() => {
    var m;
    if (!(!F && g || f) && (window.scrollY !== h || !g)) {
      const C = (m = $.current) == null ? void 0 : m.getBoundingClientRect();
      C && l(C), g || (b(!0), setTimeout(() => {
        z(!0);
      }, 50)), I(window.scrollY);
    }
  }, [h, F, $, g, f]);
  u(() => {
    if (f) {
      V("");
      return;
    }
    let m = `translate3d(${S})`;
    r || (m += ` scale(${c})`), V(m);
  }, [S, c, r, f]), u(() => {
    if (!i || !e || !y || f) {
      v("");
      return;
    }
    v(`transform ${e}s ${i}`);
  }, [i, e, y, f]), u(() => (f || H.register(R), () => {
    H.unregister(R);
  }), [R, f]);
  const q = E.isValidElement(s) ? E.cloneElement(s, {
    style: {
      ...s.props.style ?? {},
      transform: P,
      willChange: f ? "auto" : "transform",
      transition: k
    },
    ref: $
  }) : null;
  return /* @__PURE__ */ E.createElement("div", { ref: j, style: {
    overflow: r ? "visible" : "hidden"
  }, __self: void 0, __source: {
    fileName: J,
    lineNumber: 111,
    columnNumber: 5
  } }, q);
};
export {
  X as default
};
