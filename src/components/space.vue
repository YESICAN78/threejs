<!--
 * @Author: SunFulin
 * @Version: 2.0
 * @createDate: Do not edit
 * @LastEditTime: 2021-10-16 21:23:14
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
      const space = document.getElementById("space");
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x222222);
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      this.camera.position.set(8, 4, 0);
      // 参数2是光的亮度
      let light0 = new THREE.AmbientLight(0x404040, 0.25);
      let light1 = new THREE.AmbientLight(0x404040, 0.4);
      light1.position.set(200, 90, 40);
      let light2 = new THREE.AmbientLight(0x404040, 0.4);
      light2.position.set(200, 90, -40);
      this.scene.add(light0);
      this.scene.add(light1);
      this.scene.add(light2);
      // 显示三位坐标
      let axes = new THREE.AxisHelper(20);
      //添加 坐标系到场景中
      this.scene.add(axes);

      // 创建参考线
      let gh = new THREE.GridHelper(
        60,
        100,
        new THREE.Color(0x555555),
        new THREE.Color(0x333333)
      );
      this.scene.add(gh);

      // 创建立方体
      let geometry = new THREE.BoxGeometry(5, 5, 5);
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry, material);
      cube.position.x = 2.5;
      cube.position.y = 2.5;
      cube.position.z = 2.5;
      this.scene.add(cube);

      //创建渲染容器
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // 将渲染容器添加到节点中
      space.appendChild(this.renderer.domElement);
      /**
       *
       * */
      this.contorols = new MapControls(this.camera, this.renderer.domElement);
      this.contorols.enableDamping = true;
      this.contorols.dampingFactor = 0.25;
      this.contorols.screenSpacePanning = false; //是否可以平移
      this.contorols.maxDistance = 800;
      this.contorols.minDistance = 0;
      this.contorols.update(); //调用update方法加载更新数据
      this.update();

      this.getGeoJson();
    },
    update() {
      requestAnimationFrame(this.update);
      this.renderer.render(this.scene, this.camera);
      this.contorols.update();
    },
    async getGeoJson() {
      const { data } = await this.axios.get("/static/export.geojson");
      this.loadindBuilding(data);
    },
    loadindBuilding(data) {
      let features = data.features;
      for (let i = 0; i < features.length; i++) {
        let fle = features[i];
        if (!fle["properties"]) return;
        if (fle.properties["building"]) {
          this.addBuilding(
            fle.geometry.coordinates,
            fle.properties,
            fle.properties["building:levels"]
          );
        }
      }
    },
    async addBuilding(data, info, height) {
      for (let i = 0; i < data.length; i++) {
        let le = data[i];
        let shape = await this.genShape(le, this.center);
        let config = {
          curveSegments: 1,
          depth: 0.05 * height,
          bevelEnabled: false,
        };
        let geomometry = this.Geometry(shape, config);
        geomometry.rotateX(Math.PI / 2);
        geomometry.rotateZ(Math.PI);
        let mesh = new THREE.Mesh(geomometry, null);
        this.scene.add(mesh);
      }
    },
    async genShape(points, center) {
      let shape = new THREE.Shape();
      for (let i = 0; i < points.length; i++) {
        let elp = points[i];
        elp = await this.GPSRelativePosition(elp, this.center);
        if (i == 0) {
          shape.moveTo(elp[0], elp[1]);
        } else {
          shape.lineTo(elp[0], elp[1]);
        }
      }
      return shape;
    },
    Geometry(shape, config) {
      let geometry = new THREE.ExtrudeBufferGeometry(shape, config);
      geometry.computeBoundingBox();
      return geometry;
    },
    GPSRelativePosition(objPosi, centerPosi) {
      let dis = GEOLIB.getDistance(objPosi, centerPosi);
      let bearing = GEOLIB.getRhumbLineBearing(objPosi, centerPosi);
      let x = centerPosi[0] + dis * Math.cos((bearing * Math.PI) / 180);
      let y = centerPosi[1] + dis * Math.sin((bearing * Math.PI) / 180);
      return [-x / 100, y / 100];
    },
  },
};
</script>

<style scoped lang="less"></style>
