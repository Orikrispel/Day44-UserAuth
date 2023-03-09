
const fs = require('fs')

const gBugs = require('../data/bug.json')


module.exports = {
    query,
    getById,
    remove,
    save,
    queryUserBugs
}

const PAGE_SIZE = 3

function query(filterBy = { txt: '', minSeverity: 1, label: '', page: 0 }, sortBy = {}) {
    let bugs = gBugs
    if (sortBy.createdAt === 'true') {
        bugs.sort((a, b) => (a.createdAt - b.createdAt) * sortBy.desc)
    }

    const regex = new RegExp(filterBy.txt, 'i')
    bugs = bugs.filter(bug => regex.test(bug.title) || regex.test(bug.description))
    bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    if (filterBy.label) {
        bugs = bugs.filter(bug => bug.labels.includes(filterBy.label))
    }

    const totalPages = Math.ceil(gBugs.length / PAGE_SIZE)
    const startIdx = filterBy.page * PAGE_SIZE
    bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)

    return Promise.resolve({
        totalPages,
        bugs
    })
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unknonwn bug')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknonwn bug')
    if (gBugs[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
        return Promise.reject('Not authorized to delete this bug')
    }

    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    var savedBug
    if (bug._id) {
        savedBug = gBugs.find(currBug => currBug._id === bug._id)
        if (!savedBug) return Promise.reject('Unknonwn bug')
        if (gBugs[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
            return Promise.reject('Not authorized to delete this bug')
        }
        savedBug.title = bug.title
        savedBug.description = bug.description
        savedBug.severity = bug.severity
        savedBug.labels = bug.labels
    } else {
        savedBug = {
            _id: _makeId(),
            title: bug.title,
            description: bug.description,
            severity: bug.severity,
            labels: bug.labels,
            createdAt: Date.now(),
            creator: {
                _id: loggedinUser._id,
                fullname: loggedinUser.fullname
            }
        }
        gBugs.push(savedBug)
    }
    return _saveBugsToFile().then(() => {
        return savedBug
    })
}

function queryUserBugs(userId = '') {
    let bugs = []
    bugs = gBugs.filter(bug => bug.creator._id === userId)
    if (!bugs) return Promise.reject('No bugs valid')
    return Promise.resolve(bugs)
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
