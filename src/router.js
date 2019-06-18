import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Recording from './views/Recording.vue'
import Videos from './views/Videos.vue'
import Playback from './views/Playback.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
	{
		path: '/rec',
		name: 'recording',
		component: Recording
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
