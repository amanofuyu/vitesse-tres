/// <reference types="vitest" />

import path from 'node:path';
import { templateCompilerOptions } from '@tresjs/core';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueMacros from 'unplugin-vue-macros/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	resolve: {
		alias: {
			'@/': `${path.resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [
		VueMacros({
			defineOptions: false,
			defineModels: false,
			plugins: {
				vue: Vue({
					script: {
						propsDestructure: true,
						defineModel: true,
					},
					...templateCompilerOptions,
				}),
			},
		}),

		// https://github.com/posva/unplugin-vue-router
		VueRouter(),

		// https://github.com/antfu/unplugin-auto-import
		AutoImport({
			imports: [
				'vue',
				'@vueuse/core',
				VueRouterAutoImports,
				{
					// add any other imports you were relying on
					'vue-router/auto': ['useLink'],
				},
			],
			dts: true,
			dirs: ['./src/composables'],
			vueTemplate: true,
		}),

		// https://github.com/antfu/vite-plugin-components
		Components({
			dts: true,
		}),

		glsl(),
	],

	// https://github.com/vitest-dev/vitest
	test: {
		environment: 'jsdom',
	},
});