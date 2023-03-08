'use strict'

import { bugService } from '../services/bug.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <p><u>Description:</u> {{bug.description}}</p>
        <div class="labels">
          <p class="label" v-for="label in bug.labels">{{label}}</p>
        </div>
        <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
        <router-link to="/bug">Back</router-link>
    </section>
    `,
  data() {
    return {
      bug: null,
    }
  },
  created() {
    const { bugId } = this.$route.params
    if (bugId) {
      bugService.getById(bugId).then((bug) => {
        this.bug = bug
      })
        .catch(err => {
          console.error('Error:', err)
          alert('Only premium users can see more that 3 bugs')
        })
    }
  },
  computed: {
    labels() {
      return this.bug.labels.join(', ')
    }
  }
}
