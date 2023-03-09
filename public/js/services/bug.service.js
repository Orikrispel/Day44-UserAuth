import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

// _createBugs()

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  queryUserBugs
}

function query(filterBy = {}, sortBy = {}) {
  return axios.get(`/api/bug`, { params: { ...filterBy, ...sortBy } })
    .then(res => res.data)
}

function getById(bugId) {
  return axios.get(`/api/bug/${bugId}`)
    .then(res => res.data)
}

function remove(bugId) {
  return axios.delete(`/api/bug/${bugId}`)
    .then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    return axios.put(`/api/bug/${bug._id}`, bug)
      .then(res => res.data)
  } else {
    return axios.post(`/api/bug`, bug)
      .then(res => res.data)
  }
}

function queryUserBugs(loggedInUserId) {
  return axios.get(`/api/bug/user/${loggedInUserId}`, { params: loggedInUserId })
    .then(res => res.data)
}

function getEmptyBug() {
  return {
    title: '',
    description: '',
    severity: '',
    labels: [],
  }
}

// function _createBugs() {
//   let bugs = utilService.loadFromStorage(STORAGE_KEY)
  // if (!bugs || !bugs.length) {
  //   bugs = []
  //   bugs.push(_createBug('Button is missing', 1))
  //   bugs.push(_createBug('Error while watching', 2))
  //   bugs.push(_createBug('Warning appears', 3))
  // utilService.saveToStorage(STORAGE_KEY, bugs)
  // }
// }

// function _createBug(title, severity = 1) {
//   const bug = getEmptyBug(title, severity)
//   bug._id = utilService.makeId()
//   return bug
// }


