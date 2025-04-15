import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import axios from 'axios'

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

const Notification = ({ message, succesMessage }) => {
  if (message === null && succesMessage === null) return null;

  return (
    <div>
      {succesMessage ? (
        <div className="message">{succesMessage}</div>
      ) : null}
      {message ? (
        <div className="error">{message}</div>
      ) : null}
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
    {persons.map((person) =>
      (person.name && person.number) ? (
        <li key={person.id}>
          <h3>
            {person.name} : {person.number}
            <button onClick={() => onDelete(person.id)}>Delete</button>
          </h3>
        </li>
      ) : null
    )}
  </ul>
)




const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('You have a error papabello...')
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilter] = useState('')
  const [succesMessage, setSuccesMessage] = useState('Vas a agregar una persona?')
  const [countries, setCountries] = useState([])
  const [searchItem, setSearchItem] = useState("")



  useEffect(() => {
    noteService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter(n => n.id !== id))
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

  const handleNoteChange = (event) => setNewNote(event.target.value)
  const handlepersonChange = (event) => setNewNumber(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const filterPerson = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    setSuccesMessage("Has agregado una persona")
    setTimeout(() => {
      setSuccesMessage("")
    }, 5000)

    const personExist = persons.find((person) => person.name === newName)

    if (personExist) {
      const confirmUpdate = window.confirm(
        `${newName} this person exist in the form, replace the old number with a new number?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...personExist, number: newNumber }
        noteService
          .update(personExist.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== personExist.id ? p : returnedPerson
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
      number: newNumber
    }

    noteService.create(personObject).then(personBack => {
      setPersons(persons.concat(personBack))
      setNewName('')
      setNewNumber('')
      setErrorMessage(`Added ${personBack.name}`)
      setTimeout(() => setErrorMessage(null), 5000)
    })
  }

  const deletePerson = (id) => {
    const person = persons.find(persona => persona.id === id)
    const confirmDelete = window.confirm(`Do you want to delete this person in the form? ${person.name}?`)

    if (confirmDelete) {
      noteService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(persona => persona.id !== id))
          setSuccesMessage(`${person.name} has been deleted`)
          setTimeout(() => setSuccesMessage(''), 5000)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setErrorMessage(`The person '${person.name}' has already been deleted from the server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(persona => persona.id !== id))
          } else {
            setErrorMessage(`Failed to delete ${person.name}`)
            setTimeout(() => setErrorMessage(null), 5000)
          }
        })
    }
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    : persons

  useEffect(() => {
    if (searchItem.trim() === '') {
      setCountries([])
      return
    }

    const searchCountries = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${searchItem}`
        const response = await axios.get(url)
        const data = response.data
        console.log("Países recibidos:", data)
        setCountries(data)
      } catch (error) {
        console.error("Error fetching:", error.message)
        setCountries([])
      }
    }

    searchCountries()
  }, [searchItem])

  const findLenguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(', ')
    } else if (typeof languages === 'object') {
      return Object.values(languages).join(', ')
    } else {
      return 'unknow'

    }

  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <Notification succesMessage={succesMessage} />

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
      <Persons persons={personsToShow} onDelete={deletePerson} />
      <h1 >Find country system</h1>
      <p>find countries:
        <input type="text" value={searchItem} onChange={(change) => setSearchItem(change.target.value)} placeholder='Enter the country to search' />
      </p>
      {countries.length > 10 && (
        <p>You entered too many matches, Please be more specific.</p>
      )}
      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matchin countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common}>{country.name.common}</li>
            ))}
          </ul>
        </div>
      )}
      {countries.length === 1 && (
        <div>
          <h3>{countries[0].name.common}</h3>
          <p>Capital:{countries[0].capital}</p>
          <p>Area:{countries[0].area}</p>
          <p>Population: {countries[0].population}</p>
          <p>Lenguage: {countries[0].languages && findLenguage(countries[0].languages)}</p>
          <img src={countries[0].flags.svg} alt={`Flag of ${countries[0].name.common}`} width="150" />
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App
