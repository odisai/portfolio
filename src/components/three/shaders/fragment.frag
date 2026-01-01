// Fragment shader with iridescence and state transitions

uniform float uTime;
uniform float uResolved; // 0 = searching, 1 = resolved
uniform vec3 uColorSearching;
uniform vec3 uColorResolved;
uniform vec3 uIridescentBlue;
uniform vec3 uIridescentPurple;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  // Fresnel rim lighting
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
  
  // Iridescent shift based on view angle and time
  float iridescenceShift = fresnel + sin(uTime * 0.5) * 0.1;
  vec3 iridescence = mix(uIridescentBlue, uIridescentPurple, iridescenceShift);
  
  // Base color with searching state (cool + iridescent)
  vec3 searchingColor = uColorSearching + iridescence * 0.3;
  
  // Transition from searching to resolved
  vec3 finalColor = mix(searchingColor, uColorResolved, uResolved);
  
  // Add rim glow when resolved
  finalColor += fresnel * uResolved * 0.2;
  
  gl_FragColor = vec4(finalColor, 1.0);
}

