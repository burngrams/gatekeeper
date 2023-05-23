// write a function that watches the directory for changes
// and then emits an event when a change occurs on an event emitter
// that is exported from this file. the event emitter should be exported as a singleton
// the event emitter emits events not at the file level, but rather at the "operation level", and it emits the following events:
// "mutation" - when a row in the database has been changed. it emits the row that has been changed and the operation that has been performed on it, and who performed the operation
//
