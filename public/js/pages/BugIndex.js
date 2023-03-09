'use strict'
import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js'
import { showErrorMsg } from "../services/event-bus.service.js"
import bugList from '../cmps/BugList.js'
import bugFilter from '../cmps/BugFilter.js'

export default {
	template: `
    <section class="bug-app">
        <div class="subheader">
          <bug-filter @setFilterBy="setFilterBy" @setSortBy="setSortBy"></bug-filter> ||
          <router-link to="/bug/edit">Add New Bug</router-link> 
        </div>
        <bug-list v-if="bugs" :bugs="bugs" @removeBug="removeBug"></bug-list>
				<button @click="getPage(-1)">Prev</button>
        <button @click="getPage(1)">Next</button>
    </section>
    `,
	data() {
		return {
			bugs: [],
			filterBy: {
				txt: '',
				minSeverity: 1,
				labels: [],
				page: 0
			},
			sortBy: {
				createdAt: false,
				desc: 1
			},
			PAGE_SIZE: 3
		}
	},
	created() {
		this.loadBugsLater = utilService.debounce(this.loadBugs, 500)
		this.loadBugs()
	},
	methods: {
		loadBugs() {
			bugService.query(this.filterBy, this.sortBy).then(({ bugs, totalPages }) => {
				this.bugs = bugs
				this.totalPages = totalPages
				console.log('total pages:', this.totalPages)
			})
		},
		getPage(dir) {
			this.filterBy.page += dir
			if (this.filterBy.page < 0) this.filterBy.page = 0
			if (this.filterBy.page >= this.totalPages) {
				this.filterBy.page -= 1
				return
			}
			this.loadBugs()
		},
		removeBug(bugId) {
			bugService.remove(bugId)
				.then(() => this.loadBugs())
				.catch(err => {
					showErrorMsg('Bug remove failed', err)
				})
		},
		setFilterBy(filterBy) {
			const { txt, minSeverity, label } = filterBy
			this.filterBy.txt = txt
			this.filterBy.minSeverity = minSeverity
			this.filterBy.label = label
			this.loadBugsLater()
		},
		setSortBy(sortBy) {
			this.sortBy = sortBy
			this.loadBugs()
		},
	},

	components: {
		bugFilter,
		bugList,
	},
}
