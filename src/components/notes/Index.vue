<template>
  <div class="notes" v-el:notes>
    <note
      v-for="note in notes" :note="note" v-on:click="selectNote(note)">
    </note>
  </div>
</template>
<script>
  import Masonry from 'masonry-layout'
  import Note from './Notes'
  import noteRepository from '../../data/NoteRepository'
  export default {
    components: {
      Note
    },
    data () {
      return {
        notes: []
      }
    },
    methods: {
      selectNote ({key, title, content}) {
        this.$dispatch('note.selected', {key, title, content})
      }
    },
    watch: {
      'notes': {
        handler () {
          this.masonry.reloadItems()
          this.masonry.layout()
        },
        deep: true
      }
    },
    ready () {
      this.masonry = new Masonry(this.$els.notes, {
        itemSelector: '.note',
        columnWidth: 240,
        gutter: 16,
        fitWidth: true
      })
      noteRepository.on('added', (note) => {
        this.notes.unshift(note)
      })
      noteRepository.on('changed', ({key, title, content}) => {
        let outdatedNote = noteRepository.find(this.notes, key)
        outdatedNote.title = title
        outdatedNote.content = content
      })
      noteRepository.on('removed', ({key}) => {
        let noteToRemove = noteRepository.find(this.notes, key)
        this.notes.$remove(noteToRemove)
      })
    }
  }
</script>
<style>
.notes{
   margin: 0 auto;
 }
</style>
