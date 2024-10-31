<script setup lang="ts" generic="T extends any, O extends any">
import { OrbitControls } from '@tresjs/cientos';
import { TresCanvas, type TresInstance, useRenderLoop } from '@tresjs/core';
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three';
import { Pane } from 'tweakpane';
import fragmentShader from '@/glsl/example/el1.frag';
import vertexShader from '@/glsl/example/el1.vert';
import { Vector2 } from 'three';

const uniforms = {
	uTime: { value: 0 },
	uAmplitude: { value: new Vector2(0.1, 0.1) },
	uFrequency: { value: new Vector2(20, 5) },
};

const blobRef = shallowRef<TresInstance | null>(null);

const { onLoop } = useRenderLoop();

onLoop(({ elapsed }) => {
	if (blobRef.value) {
		blobRef.value.material.uniforms.uTime.value = elapsed;
	}
});

const pane = new Pane();

const gl = reactive({
	clearColor: '#F78B3D',
	shadows: true,
	alpha: false,
	shadowMapType: BasicShadowMap,
	outputColorSpace: SRGBColorSpace,
	toneMapping: NoToneMapping,
	windowSize: true,
});

pane.addBinding(gl, 'clearColor');

defineOptions({
	name: 'IndexPage',
});
</script>

<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera
      :position="[4, 4, 18]"
      :look-at="[0, 2, 0]"
    />
    <OrbitControls />

    <Suspense>
      <UgglyBunny />
    </Suspense>

    <TresMesh  ref="blobRef" :position="[0, 0, 0]">
      <TresSphereGeometry :args="[2, 32, 32]" />
      <TresShaderMaterial :vertex-shader="vertexShader" :fragment-shader="fragmentShader" :uniforms="uniforms" />
    </TresMesh>

    <TresDirectionalLight
      color="#F78B3D"
      :position="[3, 3, 3]"
      :intensity="1"
    />
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>
