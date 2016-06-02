import EventEmitter from 'events'
import Firebase from 'firebase'

class NoteRepository extends EventEmitter {
  constructor () {
    super()
    this.ref = new Firebase('https://gkeepvis.firebaseio.com/notes')
    this.attachFirebaseListeneres()
  }
  attachFirebaseListeneres () {
    this.ref.on('child_added', this.onAdded, this)
    this.ref.on('child_removed', this.onRemoved, this)
    this.ref.on('child_changed', this.onChanged, this)
  }
  onAdded (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('added', note)
  }
  onRemoved (oldSnapshot) {
    let note = this.snapshotToNote(oldSnapshot)
    this.emit('removed', note)
  }
  onChanged (snapshot) {
    let note = this.snapshotToNote(snapshot)
    this.emit('changed', note)
  }
  snapshotToNote (snapshot) {
    let key = snapshot.key()
    let note = snapshot.val()
    note.key = key
    return note
  }

  create ({title = '', content = ''}, onComplete) {
    this.ref.push({title, content}, onComplete)
  }

  update ({key, title = '', content = ''}, onComplete) {
    this.ref.child(key).update({title, content}, onComplete)
  }

  delete ({key}, onComplete) {
    this.ref.child(key).remove(onComplete)
  }

  findIndex (notes, key) {
    return notes.findIndex(note => note.key === key)
  }

  find (notes, key) {
    return notes.find(note => note.key === key)
  }
}
export default new NoteRepository()
