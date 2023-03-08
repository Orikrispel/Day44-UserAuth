'use strict'

export default {
  template: `
        <section class="bug-filter">
        <label>Sort by:
          <select @change="setSortBy" name="label" v-model="sortBy.createdAt">
            <option :value="false" selected>Sort by</option>
            <option :value="true">createdAt</option>
          </select>
          <label class="desc-label" for="desc">Desc
            <input @input="onSetDesc" id="desc" :value="sortBy.desc" type="checkbox">
          </label>
        </label>

        <label>Filter by title: 
          <input @input="setFilterBy" type="text" v-model="filterBy.txt" placeholder="search">
        </label>
        <label for="min-severity"> Min severity:
          <input @input="setFilterBy" type="range" v-model="filterBy.minSeverity" min="1" max="3">
          <span>{{filterBy.minSeverity}}</span>
        </label>
        <label>Filter by label: 
        <select @change="setFilterBy" name="label" v-model="filterBy.label">
          <option value="" selected>Choose label</option>
          <option value="critical">critical</option>
        <option value="need-CR">need-CR</option>
          <option value="dev-branch">dev-branch</option>
         </select>
       </label>
      </section>
    `,
  data() {
    return {
      filterBy: {
        txt: '',
        minSeverity: 1,
        label: '',
      },
      sortBy: {
        createdAt: false,
        desc: 1
      }
    }
  },
  methods: {
    setFilterBy() {
      this.$emit('setFilterBy', this.filterBy)
    },
    setSortBy() {
      this.$emit('setSortBy', this.sortBy)
    },
    onSetDesc() {
      //HERE
      this.sortBy.desc *= -1
      this.setSortBy()
    },
  },
}
