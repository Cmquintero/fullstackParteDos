import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const Footer = () => {
  const footerStyle = {
    color: "blue",
    fontStyle: 'italic',
    fontSize: 20
  }
  return (
    <div style={footerStyle}>
      <br />
      <p>Note app, Department of Computer Science, University of Helsinki 2024</p>
    </div>
  )
}

const Notification = ({ message }) => {
  
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}
const Filter = ({ filterText, filterPerson }) => (
  <form>
    <div>
      Filter for name: <input value={filterText} onChange={filterPerson} />
    </div>
  </form>
)

const PersonForm = ({ newName, newNumber, handlepersonChange, handleNoteChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNoteChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handlepersonChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons, onDelete }) => (
  <ul>
    {persons.map((person) => (
      <li key={person.id}>
        <h3>
          {person.name } : { person.number } ¿
          <button onClick={() => onDelete (person.id)}> Delete</button>?
        </h3>
      </li>
    ))}
  </ul>
)


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('You have a error papabello...')
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  
  const hook = () => {
    noteService
      .getAll()
      .then(initialPerson => {
        setPersons(initialPerson)
        setFilter(initialPerson)
      })
      .catch((error)=>{
        console.error("Error in get",error)
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const [persons, setPersons] = useState([
    {
      name: 'Arto Hellas',
      number: "315478944",
      id: 1
    },
    {
      name: 'Carlos Quintero',
      number: '312517135',
      id: 2
    }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilter] = useState('')

  const handlepersonChange = (event) => setNewNumber(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const filterPerson = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()

    const personExist = persons.find((person) => person.name === newName)
    /*if (personExist) {
      alert(newName + ' This person already exists in the form ')
      return
    }*/
    if (personExist) {
      const confirmUpdate = window.confirm(
        `${newName} this person exist in the form, replace the old number with a new number?`
      )
    
    if (confirmUpdate) {
      const updatedPerson = { ...personExist, number: newNumber }
      noteService
      .update(personExist.id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => 
          person.id !== personExist.id ? person : returnedPerson
        ))
        setNewName('')
        setNewNumber('')
        setErrorMessage(`Updated ${returnedPerson.name}'s number`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
      .catch(error => {
        setErrorMessage(`Information of ${personExist.name} has already been removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setPersons(persons.filter(p => p.id !== personExist.id))
      })
  }
  return
}
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length +1 + 1 //Es Algo extraño pero en la creacion del id no me daba como queria y no me habia fijado en que contaba el arreglo desde 0 y el id desde 1 por eso decidi crear el +1+1 para que asi el id no de un numero incorrecto
    }
    noteService.create( personObject).then(personBack => {
      console.log(personBack)
    setPersons(persons.concat(personBack))
    setNewName('')
    setNewNumber('')
    setErrorMessage(`Added ${personBack.name}`)
    setTimeout(() => setErrorMessage(null), 5000)
    })
    
  }
  const deletePerson = (id) => {
    const person = persons.find(persona => persona.id === id)
    const confirmDelete = window.confirm(`do you want delete this person in the form? ${person.name}?`)
    
    if (confirmDelete) {
      noteService
        .Delete(id)
        .then(() => {
          setPersons(persons.filter(persona => persona.id !== id))
        })
        .catch(error => {
          alert(`The person '${person.name}' The person always delete`)
          setPersons(persons.filter(persona => persona.id !== id)) 
        })
    }
  }

  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    : persons

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <h2>Phonebook</h2>
      <Filter filterText={filterText} filterPerson={filterPerson} />
      <h2>Add New</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNoteChange={handleNameChange}
        handlepersonChange={handlepersonChange}
        handleSubmit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={ personsToShow } onDelete={ deletePerson } />
      <Footer />
    </div>
  )
}

export default App
