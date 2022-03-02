<!--
 * @Author: SunFulin
 * @Version: 2.0
 * @createDate: Do not edit
 * @LastEditTime: 2022-03-02 22:37:50
-->
<template>
  <div class="space" id="space"></div>
</template>
<script>
import * as THREE from "three";
import * as GEOLIB from "geolib";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "space",
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      contorols: null,
      center: [-3.188822, 55.943686],
      height: 300,
      width: 500,
    };
  },
  mounted() {
    this.initThree();
    window.addEventListener("resize", this.onResize());
  },
  methods: {
    onResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    initThree() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.width, this.height);
      let element = document.getElementById("space");
      element.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      // 正交投影摄像机
      this.camera = new THREE.PerspectiveCamera(45, 500 / 300, 2, 500);
      this.camera.position.set(0, 0, 40); // 摄像机位置
      // 照相机默认沿z轴负方向观察，通过设置lookAt的位置可以改变观察的方向
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(this.camera);

      let planeGeometry = new THREE.PlaneBufferGeometry(
        this.width,
        this.height
      );

      planeGeometry.translate(0, 0, 400);
      // 背景纹理
      let planeTexture = new THREE.TextureLoader().load("./bg.jpg");
      // 背景材料
      let planeMaterial = new THREE.MeshBasicMaterial({
        map: planeTexture,
      });
      // 背景网格
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      // 将背景添加到场景
      this.scene.add(plane);
    },
  },
};
</script>

<style scoped lang="less"></style>
