import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/editor",
        },
        {
            path: '/game',
            name: 'game',
            component: () => import('@/views/Game.vue')
        },
        {
            path: '/editor',
            name: 'editor',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/Editor.vue')
        }
    ]
})

export default router
