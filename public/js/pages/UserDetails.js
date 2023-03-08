import { userService } from "../services/user.service.js"
import { bugService } from '../services/bug.service.js'
import bugList from '../cmps/BugList.js'

export default {
    template: `
        <section class="user-details" v-if="user">
            <h5 v-if="isMyProfile">My Profile</h5>
            <pre>{{user}}</pre>   
            <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
            <RouterLink to="/">Back to list</RouterLink>
        </section>
    `,
    data() {
        return {
            loggedinUser: userService.getLoggedInUser(),
            user: null,
            bugs: [],
        }
    },
    created() {
        this.loadUser()
        this.loadBugs()
    },
    computed: {
        userId() {
            return this.$route.params.userId
        },
        isMyProfile() {
            if (!this.loggedinUser) return false
            return this.loggedinUser._id === this.user._id
        },
    },

    methods: {
        loadUser() {
            userService.get(this.userId)
                .then(user => this.user = user)
        },
        loadBugs() {
            bugService.queryUserBugs(this.loggedinUser._id)
                .then((bugs) => this.bugs = bugs)
        },
        getPage(dir) {
            this.filterBy.page += dir
            if (this.filterBy.page < 0) this.filterBy.page = 0
            if (this.filterBy.page < 0) this.filterBy.page = this.totalPages - 1
            this.loadBugs()
        },
        removeBug(bugId) {
            bugService.remove(bugId)
                .then(() => this.loadBugs())
                .catch(err => {
                    showErrorMsg('Bug remove failed')
                })
        },
    },
    components: {
        bugList,
    }
}