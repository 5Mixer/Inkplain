import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Recording from './views/Recording.vue'
import Videos from './views/Videos.vue'
import About from './views/About.vue'
import Playback from './views/Playback.vue'
import VideoManager from './views/VideoManager.vue'
const axios = require('axios')

Vue.use(Router)

const router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/record',
			name: 'recording',
			meta: { auth: true },
			component: Recording
			// component: function () { 
				// return import(/* webpackChunkName: "recording" */ './views/Recording.vue')
			// }
		},
		{
			path: '/manage/',
			name: 'manage',
			meta: { auth: true },
			component: VideoManager
		},
		{
			path: '/play/',
			name: 'videos',
			component: Videos
		},
		{
			path: '/play/:id',
			name: 'playback',
			component: Playback
		},
		{
			path: '/about',
			name: 'about',
			component: About
		}
	]
})
router.beforeEach((to, from, next) => {
	if (to.meta == undefined || !to.meta.auth) {
		next()
		return
	}

	axios.get(`api/user/`, { withCredentials: true }).then(function(response) {
		// Should the page transfer to the auth required page be cancelled?
		next((response.success == false || response.data.email == undefined) ? false : undefined)

	}.bind(this))
})
export default router
