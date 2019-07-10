import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Recording from './views/Recording.vue'
import Videos from './views/Videos.vue'
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
			path: '/rec',
			name: 'recording',
			meta: { auth: true },
			component: Recording
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
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: function () { 
				return import(/* webpackChunkName: "about" */ './views/About.vue')
			}
		}
	]
})
router.beforeEach((to, from, next) => {
	if (to.meta == undefined || !to.meta.auth) {
		next()
		return
	}

	axios.get(`http://localhost:3000/user/`, { withCredentials: true }).then(function(response) {
		console.log(response.data)
		next(response.data.email == undefined ? 0 : 1)
	}.bind(this))
})
export default router
