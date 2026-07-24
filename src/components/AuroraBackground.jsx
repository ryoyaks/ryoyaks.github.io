/* eslint-disable react/no-unknown-property, react/prop-types */
/* R3F maps three.js props (args/uniforms/fragmentShader/…) onto intrinsic
   JSX elements — the same pattern the repo's other R3F components use. */
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// aurora-shape.glsl, ported from the locked "G3 shader (violet)" Pencil design.
// The original masked the flow to an SDF shape (u_shape); here the hero background
// is full-bleed, so sceneSDF returns a constant "inside" distance — we keep the
// flowing FBM colour field and drop the shape mask.
const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;
  uniform float u_gradientAngle;
  uniform float u_turbulence;
  uniform float u_detail;
  uniform float u_rim;
  uniform vec3 u_rimColor;

  const float GRAIN_AMOUNT = 0.04;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  float octave(vec2 p, float t) {
    float v = sin(p.x * 3.0 + t);
    v += sin(p.y * 3.7 - t * 0.8);
    v += sin((p.x + p.y) * 2.3 + t * 0.6);
    v += sin(length(p - 0.5) * 6.0 - t);
    return v * 0.25;
  }
  float fbm(vec2 p, float t) {
    float v = 0.0, amp = 0.65;
    for (int i = 0; i < 3; i++) { v += octave(p, t) * amp; p *= 2.0; t *= 1.2; amp *= 0.5; }
    return v;
  }
  float flowField(vec2 p, float t, out float warp) {
    vec2 q = vec2(fbm(p, t), fbm(p + vec2(5.2, 1.3), t));
    vec2 r = vec2(fbm(p + 1.8 * q + vec2(1.7, 9.2), t * 0.6), fbm(p + 1.8 * q + vec2(8.3, 2.8), t * 0.6));
    warp = length(r);
    return fbm(p + 2.0 * r, t);
  }
  float ease(float x) { return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
  vec3 paletteColor(float t) {
    float seg = fract(t) * 4.0;
    float f = ease(fract(seg));
    if (seg < 1.0) return mix(u_color1, u_color2, f);
    if (seg < 2.0) return mix(u_color2, u_color3, f);
    if (seg < 3.0) return mix(u_color3, u_color4, f);
    return mix(u_color4, u_color1, f);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float angle = radians(u_gradientAngle);
    vec2 dir = vec2(cos(angle), sin(angle));
    float gradient = dot(uv - 0.5, dir) + 0.5;

    float t = u_time * u_speed;
    vec2 drift = dir * 0.5 * t;
    float warp;
    float flow = flowField(uv * u_detail + drift + u_gradientAngle, t, warp) * u_turbulence;

    vec3 color = paletteColor(gradient * 0.3 + t + flow);
    color += smoothstep(0.5, 1.4, warp) * 0.18 * vec3(0.9, 0.95, 1.0);
    color *= 0.78 + 0.22 * smoothstep(1.3, 0.0, warp);

    float rim = smoothstep(-0.03, 0.0, flow * 0.06);
    color += rim * rim * rim * u_rim * u_rimColor;
    color += (hash(gl_FragCoord.xy) - 0.5) * GRAIN_AMOUNT;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const VERT = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const hex = (h) => new THREE.Color(h);

function AuroraPlane({ reduced }) {
  const mat = useRef();
  const uniforms = useMemo(
    () => ({
      u_resolution: { value: new THREE.Vector2(1440, 900) },
      u_time: { value: 0 },
      u_speed: { value: 0.2 },
      u_color1: { value: hex("#080610") },
      u_color2: { value: hex("#241c50") },
      u_color3: { value: hex("#6f57d8") },
      u_color4: { value: hex("#c9baff") },
      u_gradientAngle: { value: 30 },
      u_turbulence: { value: 0.67 },
      u_detail: { value: 0.22 },
      u_rim: { value: 0.28 },
      u_rimColor: { value: hex("#aeb8ff") },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (mat.current && !reduced) mat.current.uniforms.u_time.value += delta;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} fragmentShader={FRAG} vertexShader={VERT} uniforms={uniforms} />
    </mesh>
  );
}

// Full-bleed animated violet aurora, sized to fill its positioned parent.
export default function AuroraBackground({ reduced = false }) {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 1] }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <AuroraPlane reduced={reduced} />
    </Canvas>
  );
}
