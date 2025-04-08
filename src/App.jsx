import { useState } from 'react'

const App = () => {
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
  const handlepersonChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }
  const filterPerson = (event) => {
    setFilter(event.target.value)

  }
  const addPerson = (event) => {

    event.preventDefault()

    const personExist = persons.some((person) => person.name === newName)
    if (personExist) {
      alert(newName + ' This person already exists in the form ')
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')

  }
  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={filterPerson}>
        <div>
          Filter for name: <input value={filterText} onChange={filterPerson} />
        </div>
      </form>


      <h2>Add New</h2>
      <form onSubmit={addPerson}>
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
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person, keyfilter) => (
           <li key={keyfilter}>
           <h3>{person.name} {person.number}</h3>
         </li>

        ))}
        
      </ul>
    </div>
  )
}

export default App
