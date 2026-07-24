"use client";

import { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShaderSrc = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec2 uv = v_texCoord;
        vec2 pos = uv * vec2(u_resolution.x / u_resolution.y, 1.0);

        vec3 color1 = vec3(0.98, 0.85, 0.92);
        vec3 color2 = vec3(1.0, 0.72, 0.85);
        vec3 color3 = vec3(0.95, 0.5, 0.75);
        vec3 color4 = vec3(1.0, 0.98, 1.0);

        float t = u_time * 0.2;

        vec2 p1 = vec2(0.5 + 0.5 * sin(t), 0.5 + 0.5 * cos(t * 1.1));
        vec2 p2 = vec2(0.5 + 0.5 * cos(t * 0.7), 0.5 + 0.5 * sin(t * 0.8));

        float d1 = length(uv - p1);
        float d2 = length(uv - p2);

        vec3 bg = mix(color1, color2, smoothstep(0.0, 1.2, d1));
        bg = mix(bg, color3, smoothstep(0.0, 1.5, d2) * 0.4);
        bg = mix(bg, color4, uv.y * 0.4);

        float waves = sin(uv.x * 3.0 + t) * sin(uv.y * 2.0 - t * 1.2) * 0.1;
        bg += waves * 0.05;

        float silk = sin(pos.x * 10.0 + pos.y * 10.0 + t * 2.0) * 0.5 + 0.5;
        bg += pow(silk, 20.0) * 0.04;

        float mDist = length(uv - u_mouse / u_resolution);
        bg += (0.06 / (mDist + 0.3)) * color4;

        for (float i = 0.0; i < 30.0; i++) {
          vec2 sparklePos = vec2(
            hash(vec2(i, 0.1)) * 2.0 - 0.5,
            hash(vec2(i, 0.2)) * 2.0 - 0.5
          );
          float sparkleT = u_time * 0.001 + i * 0.5;
          float sparkleSize = 0.003 + 0.002 * sin(sparkleT * 3.0 + i);
          float sparkleDist = length(uv - sparklePos);
          float sparkle = smoothstep(sparkleSize, 0.0, sparkleDist);
          float sparkleAlpha = (0.5 + 0.5 * sin(sparkleT * 2.0 + i)) * sparkle;
          bg += sparkleAlpha * vec3(1.0, 0.95, 0.85) * 0.5;
        }

        float ray = 0.0;
        for (float r = 0.0; r < 8.0; r++) {
          vec2 rayDir = vec2(cos(t * 0.3 + r * 0.78), sin(t * 0.3 + r * 0.78));
          float rayDot = max(0.0, dot(normalize(uv - 0.5), rayDir));
          ray += pow(rayDot, 15.0) * 0.08;
        }
        bg += ray * vec3(1.0, 0.9, 1.0) * (0.5 + 0.5 * sin(t));

        gl_FragColor = vec4(bg, 1.0);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc));
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    let mouse = [0, 0];
    const handleMouseMove = (e) => {
      mouse = [e.clientX, canvas.height - e.clientY];
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId;

    function render(time) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouse[0], mouse[1]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
}
