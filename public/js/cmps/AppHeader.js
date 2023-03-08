import { userService } from "../services/user.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import LoginSignup from './LoginSignup.js'

export default {
    template: `
        <header>
            <h1>Miss Bug</h1> 
            <section v-if="loggedinUser">
                <RouterLink :to="'/user/' + loggedinUser._id">
                    {{ loggedinUser.fullname }}
                </RouterLink>
                <button @click="logout">Logout</button>
                <RouterLink :to="'/users/'" v-if="loggedinUser.isAdmin">User list</RouterLink>
            </section>
            <section v-else>
                <LoginSignup @onChangeLoginStatus="changeLoginStatus" />
            </section>
        </header>  
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser()
        }
    },
    methods: {
        changeLoginStatus() {
            this.loggedinUser = userService.getLoggedInUser()
        },
        logout() {
            userService.logout()
                .then(() => {
                    this.loggedinUser = null
                })
        },
    },
    components: {
        LoginSignup
    }
}
