import React from "react";
import whiteBoxImg from "./whitebox/white-box.png";

/**
 * Absolute-positioned PNG overlay. No hooks.
 */
export default function WhiteBox({
  x = 0,
  y = 0,
  width = 600,
  height = undefined,   // leave undefined to keep PNG aspect
  opacity = 1,
  rotate = 0,
  z = 10,
  pointerEvents = "none",
  style = {},
  className = "",
}) {
  const st = {
    position: "absolute",
    left: x,
    top: y,
    width,
    ...(height != null ? { height } : {}),
    opacity,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    zIndex: z,
    pointerEvents,
    ...style,
  };
  return <img src={whiteBoxImg} alt="" style={st} className={className} draggable={false} />;
}
