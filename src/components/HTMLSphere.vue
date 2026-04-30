<template>
  <div class="viewport" ref="viewport" @mousemove="coordinates($event)">
    <div class="world" ref="world">
      <div class="base" ref="base">
        <ThreeDMap />
      </div>
      <div class="axis x-axis" ref="xaxis"></div>
      <div class="axis y-axis" ref="yaxis"></div>
      <div class="axis z-axis" ref="zaxis"></div>
      <div
        v-for="(point, index) of x_points"
        class="point x_point"
        :style="{ transform: point.transform }"
        :key="index"
      >
        {{ point.name }}
      </div>
      <div
        v-for="(point, index) of y_points"
        class="point y_point"
        :style="{ transform: point.transform }"
        :key="index"
      >
        {{ point.name }}
      </div>
      <div
        v-for="(point, index) of z_points"
        class="point z_point"
        :style="{ transform: point.transform }"
        :key="index"
      >
        {{ point.name }}
      </div>

      <div
        v-for="(point, index) of random_points"
        class="point random_point"
        :style="{ transform: point.transform }"
        :key="index"
      >
        {{ point.name }}
      </div>

      <!-- <div v-for="edge of e" class="edge" :style="{'transform' : edge.transform }" :key="edge">
            {{point.name}}
        </div>  -->

      <div
        v-for="(point, index) of data_points"
        class="point data_point"
        :style="{ transform: point.transform }"
        @click="clickHandler(point, index)"
        :key="index"
      >
        <ReqItem :req="point.req" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useElementSize } from "@vueuse/core";
import AnimationUtils from "@/lib/AnimationUtils";
import ThreeDMap from "@/components/ThreeDMap.vue";
import Loop from "@/lib/Loop";
import { useReqStore } from "../stores/ReqStore";
import { type Req } from "@/models/Req";
import ReqItem from "./ReqItem.vue";

// props
const store = useReqStore();

// vars
let initialized = false;
const x_points = ref([] as any[]);
const y_points = ref([] as any[]);
const z_points = ref([] as any[]);
const data_points = ref([] as any[]);
const random_points = ref([] as any[]);

const utils = new AnimationUtils();

// refs to elements
const viewport = ref();
const world = ref();
const base = ref();
const xaxis = ref();
const yaxis = ref();
const zaxis = ref();

const { width, height } = useElementSize(viewport);

const w = ref(0);
const h = ref(0);
let c = {
  x: 0,
  y: 0,
  z: 0,
};
let goalAngleX = 45;
const worldAngle = { i: 0, j: 0, k: 0 };
let depth = 0;
let perspective = 1000;
let radius = 0;
let loop = null;



const coordinates = (e: MouseEvent) => {
  let y = -(0.5 - e.clientX / (<any>window).innerWidth) * 180;
  let x = (0.5 - e.clientY / (<any>window).innerHeight) * 45;
  goalAngleX = x;

  if (e.clientX < (<any>window).innerWidth / 2) {
    perspective = (e.clientX / (<any>window).innerWidth) * 2 * 1000;
  } else {
    perspective =
      c.x +
      (0.5 -
        ((e.clientX - (<any>window).innerWidth * 0.5) /
          (<any>window).innerWidth) *
          2) *
        1000;
  }

  perspective = 1000 - perspective;
  perspective = utils.clamp(perspective, 300, 1000);
};

const init = () => {
  w.value = 777; // width.value
  h.value = 777; //width.value
  c = {
    x: w.value / 2,
    y: h.value / 2,
    z: 0,
  };

  radius = w.value / 2;

  // set viewport stule
  if (viewport.value) {
    viewport.value.style.width = w.value + "px";
    viewport.value.style.height = w.value + "px";
    viewport.value.style.perspective = perspective;

    world.value.style.width = w.value + "px";
    world.value.style.height = w.value + "px";
    world.value.style.marginLeft = -w.value / 2 + "px";
    world.value.style.marginTop = -w.value / 2 + "px";
  }

  setBase();
  setXaxis(100);
  setYaxis(100);
  setZaxis(100);
  setRandomPoints();
  setData();

  initLoop();
};

const initLoop = () => {
  // start loop
  loop = new Loop();
  loop.init(() => {
    if (world.value) {
      update();
    }
  });
};

const setBase = () => {
  const t =
    "translateX( " +
    c.x +
    "px ) \
      translateY( " +
    c.y +
    "px ) \
      translateZ( " +
    0 +
    "px )";
  base.value.style["transform"] = t;

  // set axis
  const x =
    "translateX( " +
    0 +
    "px ) \
      translateY( " +
    c.y +
    "px ) \
      translateZ( " +
    0 +
    "px )";
  const y =
    "translateX( " +
    c.x +
    "px ) \
      translateY( " +
    0 +
    "px ) \
      translateZ( " +
    0 +
    "px )";
  const z =
    "translateX( " +
    0 +
    "px ) \
      translateY( " +
    c.y +
    "px ) \
      translateZ( " +
    0 +
    "px ) \
      rotateY( " +
    90 +
    "deg )";
  xaxis.value.style["transform"] = x;
  yaxis.value.style["transform"] = y;
  zaxis.value.style["transform"] = z;
};
const randomSpherePoint = (
  x0: number,
  y0: number,
  z0: number,
  radius: number,
) => {
  var u = Math.random();
  var v = Math.random();
  var theta = 2 * Math.PI * u;
  var phi = Math.acos(2 * v - 1);
  var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
  var y = y0 + radius * Math.sin(phi) * Math.sin(theta);
  var z = z0 + radius * Math.cos(phi);
  return [x, y, z];
};
const setRandomPoints = () => {
  const randomPointsCount = 111;
  for (let i = 0; i < randomPointsCount; i++) {
    const coords = randomSpherePoint(c.x, c.y, depth, radius);

    const x = coords[0];
    const y = coords[1];
    const z = coords[2];
    const t =
      "translateX( " +
      x +
      "px ) \
        translateY( " +
      y +
      "px ) \
        translateZ( " +
      z +
      "px )";

    random_points.value.push({ name: i, transform: t, x: x, y: y, z: z });
  }
};

const addDataPoint = (req: Req) => {
  const coords = randomSpherePoint(c.x, c.y, depth, radius);
  const x = coords[0];
  const y = coords[1];
  const z = coords[2];
  const t = `translateX( ${x}px ) translateY( ${y}px ) translateZ( ${z}px )`;
  
  data_points.value.push({
    req: req,
    transform: t,
    x: x,
    y: y,
    z: z
  });
};

const setData = () => {
  store.getAllReqs().forEach(req => {
    addDataPoint(req);
  });
};
// helper axis points - can comment out in HTML
const setXaxis = (angles: number) => {
  for (let i = 0; i < angles; i++) {
    let x = radius - radius * Math.cos(i);
    let y = c.y;
    let z = radius * Math.sin(i);
    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px )";
    x_points.value.push({ name: i, transform: t });
  }
};

const setYaxis = (angles: number) => {
  for (let i = 0; i < angles; i++) {
    let x = c.x;
    let y = radius - radius * Math.cos(i);
    let z = radius * Math.sin(i);
    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px )";
    y_points.value.push({ name: i, transform: t });
  }
};

const setZaxis = (angles: number) => {
  for (let i = 0; i < angles; i++) {
    let x = radius - radius * Math.cos(i);
    let y = radius - radius * Math.sin(i);
    let z = depth;
    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px )";
    z_points.value.push({ name: i, transform: t });
  }
};

const update = () => {
  worldAngle.i = goalAngleX;
  // -(utils.clamp( (goalAngleX*-1), -10, 20) );
  worldAngle.j += 0.1;
  // worldAngle.k += 0.05;

  // rotate world
  world.value.style["transform"] =
    "translateZ(" +
    depth +
    "px ) \
    rotateX( " +
    worldAngle.i +
    "deg) \
    rotateY( " +
    worldAngle.j +
    "deg)";

  // cancel out base rotation so it stays facing straight on
  let ct =
    "translateX( " +
    c.x +
    "px ) \
    translateY( " +
    c.y +
    "px ) \
    translateZ( " +
    0 +
    "px ) \
    rotateY( " +
    -worldAngle.j +
    "deg ) \
    rotateX( " +
    -worldAngle.i +
    "deg )";
  base.value.style["transform"] = ct;

  // rotate arrays to face viewport
  for (let i = 0; i < x_points.value.length; i++) {
    let x = radius - radius * Math.cos(i);
    let y = c.y;
    let z = radius * Math.sin(i);

    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px ) \
      rotateX( " +
      -worldAngle.i +
      "deg ) \
      rotateY( " +
      -worldAngle.j +
      "deg ) \
      "; // scale(0.3)

    x_points.value[i].transform = t;
  }

  for (let i = 0; i < y_points.value.length; i++) {
    let x = c.x;
    let y = radius - radius * Math.cos(i);
    let z = radius * Math.sin(i);

    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px ) \
      rotateX( " +
      -worldAngle.i +
      "deg ) \
      rotateY( " +
      -worldAngle.j +
      "deg ) \
      "; // scale(0.3)

    y_points.value[i].transform = t;
  }

  for (let i = 0; i < z_points.value.length; i++) {
    let x = radius - radius * Math.cos(i);
    let y = radius - radius * Math.sin(i);
    let z = depth;

    let t =
      "translateX( " +
      x +
      "px ) \
      translateY( " +
      y +
      "px ) \
      translateZ( " +
      z +
      "px ) \
      rotateX( " +
      -worldAngle.i +
      "deg ) \
      rotateY( " +
      -worldAngle.j +
      "deg ) \
      "; // scale(0.3)

    z_points.value[i].transform = t;
  }

  // random points
  for (let i = 0; i < random_points.value.length; i++) {
    let p = random_points.value[i];
    // console.log(random_points[i])
    // let x = c.x;
    // let y = radius - (radius * Math.cos(i));
    // let z = (radius * Math.sin(i));

    let t =
      "translateX( " +
      p.x +
      "px ) \
      translateY( " +
      p.y +
      "px ) \
      translateZ( " +
      p.z +
      "px ) \
      rotateX( " +
      -worldAngle.i +
      "deg ) \
      rotateY( " +
      -worldAngle.j +
      "deg ) \
      ";

    random_points.value[i].transform = t;
  }

  for (let i = 0; i < data_points.value.length; i++) {
    let p = data_points.value[i];
    // console.log(random_points[i])
    // let x = c.x;
    // let y = radius - (radius * Math.cos(i));
    // let z = (radius * Math.sin(i));

    let t =
      "translateX( " +
      p.x +
      "px ) \
      translateY( " +
      p.y +
      "px ) \
      translateZ( " +
      p.z +
      "px ) \
      rotateX( " +
      -worldAngle.i +
      "deg ) \
      rotateY( " +
      -worldAngle.j +
      "deg ) \
      ";

    data_points.value[i].transform = t;
  }
};

const clickHandler = (point: any, index: number) => {
  // console.log('click', point)
};

watch(width, () => {
  if (width.value && !initialized) {
    init();
    initialized = true;
  }
})


// Watch the store's reqs array for changes (add AND remove)
watch(
  () => store.reqs,
  (newReqs) => {
    const storeIds = new Set(newReqs.map(req => req.id));
    const currentIds = new Set(data_points.value.map(p => p.req.id));
    
    // Remove items that are no longer in the store
    data_points.value = data_points.value.filter(point => storeIds.has(point.req.id));
    
    // Add new items from the store
    newReqs.forEach(req => {
      if (!currentIds.has(req.id)) {
        addDataPoint(req);
      }
    });
  },
  { deep: true }
);

onMounted(() => {
  // Load existing types from localStorage
  store.loadFromLocalStorage();
});
</script>

<style scoped type="scss">
.viewport {
  /* width: 500px;
  height: 500px; */
  margin: 100px auto;
  perspective: 1000px;
}

.world {
  /* width: 500px;
  height: 500px; */
  top: 45%;
  left: 50%;
  /* margin-left: -500 * 0.5;
  margin-top: -500 * 0.5; */
  position: absolute;
  transform-style: preserve-3d;
  background-position: center;

  div {
    transform-style: preserve-3d;
    position: absolute;
  }
  .axis {
    height: 2px;
    width: 100%;
    background-color: rgba(255, 0, 255, 0.7);
    opacity: 0.2;
  }
  .x-axis {
    border: 1px dashed rgba(255, 0, 0, 0.1);
  }
  .y-axis {
    height: 100%;
    width: 2px;
    border: 1px dashed rgba(0, 255, 0, 0.1);
  }
  .z-axis {
    border: 1px dashed rgba(0, 0, 255, 0.1);
  }
  .edge {
    width: 2px;
    height: 100px;
    position: absolute;
    background-color: #fff;
    border: 1px solid red;
  }
  .point {
    font-size: 10px;
    width: 2px;
    height: 2px;
    border-radius: 10px;
    position: absolute;
    background-color: #838dee;
    color: #000;
    text-align: center;
    opacity: 0.1;
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }
  .random_point {
    font-size: 10px;
    width: 5px;
    height: 5px;
    border-radius: 10px;
    position: absolute;
    background-color: #838dee;
    color: #000;
    text-align: center;
    opacity: 0.1;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
  .data_point {
    font-size: 10px;
    width: 1px;
    height: 1px;
    position: absolute;
    background-color: #838dee;
    color: #000;
    text-align: center;
    opacity: 1;
    border: 1px solid #000;
    cursor: pointer;
    p.name {
      width: 200px;
      text-align: left;
      padding: 0 0 0 25px;
      margin: 0;
      color: white;
    }
    img {
      width: 100px;
    }
    img.anthrockocene {
      width: 200px;
    }
    .thumb {
      width: 100px;
      height: 100px;
      background-size: cover;
      background-position: center;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .base {
    position: absolute;

    width: 100%;
    height: 100%;
    margin-left: -50%;
    margin-top: -50%;
    border-radius: 50%;
  }

  .axis,
  .x_point,
  .y_point,
  .z_point,
  .random_point {
    /* border: 10px solid red; */
  }
}
</style>
