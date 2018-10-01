const fs = require('fs')

const chalk = require('chalk')
const success = chalk.green
const waiting = chalk.blue

const taskMap = {
  add: {
    cases: [ 'a', 'add' ],
  },
  toggle: {
    cases: [ 't', 'toggle' ],
  },
  remove: {
    cases: [ 'r', 'remove' ],
  },
  help: {
    cases: [ 'h', 'help' ],
  },
  exit: {
    cases: [ 'e', 'exit' ],
  },
}

const displayTodos = (todo, index)=> {
  const display = todo.isChecked ? success : waiting
  console.log(display(`${index} - [${todo.isChecked ? 'X' : ' ' }] ${todo.text}`))
}

class TodoList {
  constructor(rl, template) {
    this.todos = JSON.parse(template)
    this.cli = rl
  }
  saveData() {
    fs.writeFileSync('todos.json', JSON.stringify(this.todos), 'utf8')
  }
  load() {
    const newFilePrompt = answer => {
      const cases = [ 'y', 'Y', 'yes', 'YES' ]
      if (cases.includes(answer)) {
        this.saveData()
        this.askForATask()
      } else {
        console.log('Exiting...')
        process.exit(0)
      }
    }
    try{
      this.todos = JSON.parse(fs.readFileSync('todos.json', 'utf8'))
      this.askForATask()
    } catch (err){
      if (err.code = 'ENOENT'){
        console.log('Todo file not found. do you want generate a new one? (Y/n)')
        this.cli.question('> ', newFilePrompt)
      } else {
        console.log(err)
        process.exit(0)
      }
    }
  }
  showTodos() {
    this.todos.forEach(displayTodos)
  }

  addTodo(text) {
    if(text.length > 0){
      this.todos.push({ isChecked: false,  text })
    }
  }
  toggleTodos(ids) {
    ids.forEach(id => {
      if (this.todos[id]) {
        this.todos[id].isChecked = !this.todos[id].isChecked
      }
    })
  }
  removeTodos(ids) {
    this.todos = this.todos.filter((_, id) => !ids.includes(`${id}`))
  }

  runTask(answer, args) {
    if (taskMap.help.cases.includes(answer)) {
      this.showHelp()
      return
    }
    if (taskMap.add.cases.includes(answer)) {
      this.addTodo(args.join(' '))
    } else if (taskMap.toggle.cases.includes(answer)) {
      this.toggleTodos(args)
    } else if (taskMap.remove.cases.includes(answer)) {
      this.removeTodos(args)
    } else if (taskMap.exit.cases.includes(answer)) {
      console.clear()
      this.cli.close()
      process.exit()
    }
    this.saveData()
    this.askForATask()
  }
  askForATask() {
    console.clear()
    this.showTodos()

    console.log('type an option: (a)dd, (t)oggle, (r)emove, (h)elp, (e)xit ')
    this.cli.question('> ', answer => {
      const [ans, ...args] = answer.trim().split(' ')
      this.runTask(ans, args)
    })
  }
  showHelp() {
    console.clear()

    console.log(`
      ${chalk.bgGreen('TODO LIST NODE CLI')}\n
      Manage your todos anytime using command line!\n
      Every change will be saved in your system.\n
      usage: 'command [arguments]' - the arguments are space separated!\n

      ${chalk.green('add')} - add a new todo. \n
        Example ${chalk.inverse('add my new task')}\n
      ${chalk.blue('toggle')} - toggle the checkmark of the item(s). \n
        Example: ${chalk.inverse('toggle 0 2')}. this will check/uncheck the first item and the third.\n
      ${chalk.red('remove')} - remove items from the list. \n
        Example ${chalk.inverse('remove 0 1')}. this will remove the first two items.\n
      you can use the initial letter of each command for a shortcut\n
      > PRESS ENTER TO CONTINUE < \n
    `)
    this.cli.question('> ', answer => this.askForATask() )
  }
}

module.exports = (rl, template) => new TodoList(rl, template)
