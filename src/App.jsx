import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }

  const addPerson = (event) => {

    event.preventDefault()

    const personExist = persons.some((person) => person.name === newName)
    if (personExist) {
      alert(newName + ' This person already exists in the form ')
     return 
    }
    const personObject = {
      name: newName
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNoteChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person, keyToname) => (
          <li key={keyToname}>
            <h3>{person.name}</h3>
          </li>

        ))}
      </ul>
    </div>
  )
}

export default App
