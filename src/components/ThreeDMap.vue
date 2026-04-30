<template>
  <div class="chart-wrap" ref="el">
    <div class="output">
      {{ output }}
    </div>
    <canvas
      ref="canvas"
      id="threeJSCanvas"
      @click="onButtonClick"
      @mousemove="onMouseMove"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, render } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Loop from "@/lib/Loop";
import { useElementSize } from "@vueuse/core";

//set height
const el = ref(null);
const { width, height } = useElementSize(el);

// math
const pi = Math.PI; // 3.14159265358979;
const phi = (1 + Math.sqrt(5)) / 2; //  1.61803398874989

// graph node A.K.A. Vertex
class V {
  x: number;
  y: number;
  z: number;
  object: any;
  constructor(x: number, y: number, z: number, object: any) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.object = object;
  }
}

const NODES_COUNT = 171;
const MAX_EDGE_DISTANCE = 25;

const canvas = ref(null) as any;
const output = ref("");

let chart = null as any;
const onButtonClick = () => {
  //console.log('button click')
  //output.value = 'button click'
};
const onMouseMove = (e: MouseEvent) => {
  // console.log('mouse move', e)
  chart?.onThreeMouseMove(e);
};
const onMouseDown = (e: MouseEvent) => {
  //console.log('mouse down', e)
  chart?.onThreeMouseDown(e);
};
const onMouseUp = (e: MouseEvent) => {
  //console.log('mouse up', e)
  chart?.onThreeMouseUp(e);
};

// three js class
class ThreeDMap {
  scale: number;
  canvas: any;
  scene: any;
  camera: any;
  worldGroup: any;
  light: any;
  renderer: any;
  controls: any;
  loop: any;
  mousePos: any;
  mouseIsDown: boolean;
  w: number;
  h: number;

  constructor(canvas: any) {
    this.canvas = canvas;
    this.mouseIsDown = false;
    this.mousePos = { x: 0, y: 0 };

    this.scale = 0.5;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.z = 100;
    this.camera.lookAt(0, 0, 0);

    this.worldGroup = new THREE.Group();

    this.light = new THREE.PointLight(0x0000ff, 1, 1); // soft white light
    this.light.position.set(0, 0, -1);
    this.scene.add(this.light);

    this.scene.add(this.worldGroup);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });

    this.w = width.value;
    this.h = width.value;

    this.renderer.setSize(width.value, width.value); // square

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    this.renderer.render(this.scene, this.camera);
  }

  initLoop() {
    this.loop = new Loop();
    this.loop.init(() => {
      this.update();
      this.controls.update();
      // this.draw();
    });
  }

  update() {
    if (this.scene && this.camera) {
      this.light.rotation.x += 0.001;
      this.light.rotation.y += 0.001;

      this.worldGroup.rotation.x += 0.001;
      this.worldGroup.rotation.y += 0.001;

      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }
  }

  buildSphere() {
    const v = []; // vertexes
    const e = []; // edges
    let g = []; // both
    const scale = 50;
    for (let i = 0; i < NODES_COUNT; i++) {
      const pphi = Math.acos(-1 + (2 * i) / NODES_COUNT); // TODO overrides globl pphi
      const theta = Math.sqrt(NODES_COUNT * Math.PI) * pphi;
      const x = Math.cos(theta) * Math.sin(pphi) * scale;
      const y = Math.sin(theta) * Math.sin(pphi) * scale;
      const z = Math.cos(pphi) * scale;

      const d = 0.5;
      const geometry = new THREE.BoxGeometry(d, d, d);
      const material = new THREE.MeshBasicMaterial({ color: "#ff0000" });
      const object = new THREE.Mesh(geometry, material);
      object.position.x = x;
      object.position.y = y;
      object.position.z = z;
      this.worldGroup.add(object);

      v.push(new V(x, y, z, object));
    }

    // set edges
    for (let i = 0; i < v.length; i++) {
      for (let j = 0; j < v.length; j++) {
        // connect all of them to start with

        if (
          v[i] !== v[j] &&
          v[i].object.position.distanceTo(v[j].object.position) <
            MAX_EDGE_DISTANCE
        ) {
          e.push([v[i], v[j]]);
        }
      }
    }

    e.forEach((element) => {
      const material = new THREE.LineBasicMaterial({ color: "#5c27a5" });
      const geometry = new THREE.BufferGeometry(); // THREE.Geometry();

      let vertices = [];

      vertices.push(element[0].x, element[0].y, element[0].z);
      vertices.push(element[1].x, element[1].y, element[1].z);

      // material.opacity = 0.9;

      vertices = new Float32Array(vertices) as any;
      // const vertices = new Float32Array( [
      //   -1.0, -1.0,  1.0,
      //    1.0, -1.0,  1.0,
      //    1.0,  1.0,  1.0,

      //    1.0,  1.0,  1.0,
      //   -1.0,  1.0,  1.0,
      //   -1.0, -1.0,  1.0
      // ] );

      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      const line = new THREE.Line(geometry, material);
      this.worldGroup.add(line);
      setTimeout(() => {
        this.worldGroup.add(line);
      }, 250);
    });

    g = [v, e];
  }

  onThreeMouseMove(e: MouseEvent): void {
    //console.log('mouse move', e)
  }
  onThreeMouseDown(e: MouseEvent): void {
    this.mouseIsDown = true;
    this.mousePos.x = (e.clientX / this.w) * 2 - 1;
    this.mousePos.y = (e.clientY / this.h) * 2 + 1;
  }
  onThreeMouseUp(e: MouseEvent): void {
    this.mouseIsDown = false;
  }
}

watch(width, () => {
  if (width.value) {
    const threeJSCanvas = document.getElementById("threeJSCanvas");
    chart = new ThreeDMap(Object.freeze(threeJSCanvas));
    chart.buildSphere();
    chart.initLoop();
  }
});
</script>

<style scoped lang="scss">
.chart-wrap {
  height: 100%;
  width: 100%;
}
.output {
  font-size: 10px;
  height: 10px;
}
</style>
