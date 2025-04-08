import { useState } from 'react'
const Filter = ({ filterText, filterPerson }) => (
  <form>
    <div>
      Filter for name: <input value={filterText} onChange={filterPerson} />
    </div>
  </form>
)
const PersonForm =({newName,newNumber,handlepersonChange,handleNoteChange,handleSubmit})=>(
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
const Persons = ({ persons }) => (
  <ul>
    {persons.map((person,keyPerson) => (
      <li key={keyPerson}>
        <h3>{person.name} {person.number}</h3>
      </li>
    ))}
  </ul>
)

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
  const handlepersonChange = (event) => setNewNumber(event.target.value)
  const handleNoteChange = (event) =>setNewName(event.target.value)
  const filterPerson = (event) =>setFilter(event.target.value)

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
      <Filter filterText={filterText} filterPerson={filterPerson} />
      <h2>Add New</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNoteChange={handleNoteChange}//metodo que use ,incorrecto por que es dificil de entender, como fue nombrado,solo que me guie de el ejemplo dado en esta parte B del curso se usa para agregar el nombre
        handlepersonChange={handlepersonChange}//metodo que use ,incorrecto por que es dificil de entender, como fue nombrado,solo que me guie de el ejemplo dado en esta parte B del curso se usa para agregar el numero
        handleSubmit={addPerson}//SUBMIT que creo se deberia usar normalmente en un form
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
