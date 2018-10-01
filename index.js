
// cmd line 'console' independent of todoList functionality
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// default todos.json; examples of todo model
const template = `[
  {
    "isChecked": false,
    "text": "Check me to test if is working! "
  },
  {
    "isChecked": true,
    "text": "You can remove this template todo!"
  }
]`

// construct new file/list (with template fall-back) and tie-in 'console'
const todoList = require('./todo-list')(rl, template)

todoList.load()

