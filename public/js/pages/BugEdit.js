import { bugService } from '../services/bug.service.js'
import { eventBus } from '../services/event-bus.service.js'

export default {
  template: `
    <section v-if="bug" class="bug-edit">
        <h1>{{(bug._id) ? 'Edit Bug': 'Add Bug'}}</h1>
        <form @submit.prevent="saveBug">
            <label> 
                <span>Title: </span>
                <input type="text" v-model="bug.title" placeholder="Enter title...">
            </label>
            <label> 
                <span>Description: </span>
                <textarea v-model="bug.description" placeholder="Enter description..."></textarea>
            </label>
            <label class="severity">
                <span>Severity: </span>
                <input type="number" v-model="bug.severity" placeholder="Enter severity..." min="0" max="3">
            </label>
            <input type="checkbox" id="dev-branch" value="dev-branch" @change="toggleLabel" :checked="bug.labels.includes('dev-branch')"/>
            <label class="checkbox-label" for="dev-branch">dev-branch</label>
            <input type="checkbox" id="need-CR" value="need-CR" @change="toggleLabel" :checked="bug.labels.includes('need-CR')"/>
            <label class="checkbox-label" for="need-CR">need-CR</label>
            <input type="checkbox" id="critical" value="critical" @change="toggleLabel" :checked="bug.labels.includes('critical')"/>
            <label class="checkbox-label" for="critical">critical</label>
            <div class="actions">
              <button type="submit"> {{(bug._id) ? 'Save': 'Add'}}</button>
              <button @click.prevent="closeEdit">Close</button>
            </div>
        </form>
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
    } else this.bug = bugService.getEmptyBug()
  },
  methods: {
    toggleLabel(event) {
      const label = event.target.value
      const idx = this.bug.labels.findIndex(l => l === label)
      if (idx < 0) this.bug.labels.push(label)
      else this.bug.labels.splice(idx, 1)
    },
    saveBug() {
      if (!this.bug.title || !this.bug.severity || !this.bug.description) eventBus.emit('show-msg', { txt: 'All fields must be filled out.', type: 'error' })
      else
        bugService.save({ ...this.bug })
          .then(() => {
            eventBus.emit('show-msg', { txt: 'Bug saved successfully', type: 'success' })
            this.$router.push('/bug')
          })
          .catch(err => {
            eventBus.emit('show-msg', { txt: 'Bug save failed', type: 'error' })
          })
    },
    closeEdit() {
      this.$router.push('/bug')
    },
  },
}
