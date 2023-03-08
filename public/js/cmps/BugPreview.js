'use strict'
import { userService } from "../services/user.service.js"

export default {
  props: ['bug'],
  template: `<article className="bug-preview">
                <span>🐛</span>
                <h4>{{bug.title}}</h4>
                <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
                <div class="actions">
                  <router-link :to="'/bug/' + bug._id">Details</router-link>
                  <router-link v-if="isOwner()" :to="'/bug/edit/' + bug._id"> Edit</router-link>
                </div>
                <button v-if="isOwner()" @click="onRemove(bug._id)">X</button>
              </article>`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
    isOwner() {
      const user = userService.getLoggedInUser()
      console.log('user:', user)
      if (!user) return false
      if (user._id === this.bug.creator._id || user.isAdmin) return true
      return false
    }
  },
}
