import { useState, useEffect } from 'react'
import personServices from './services/persons'
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

const PersonForm = ({ newName, newNumber, handlepersonChange, handleNameChange, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
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
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('This view show you the error...')
  const [succesMessage, setSuccesMessage] = useState('Do you want to add a person?')
  const [countries, setCountries] = useState([])
  const [searchItem, setSearchItem] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    personServices.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  const handlepersonChange = (event) => setNewNumber(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const filterPerson = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    setSuccesMessage("Has agregado una persona")
    setTimeout(() => {
      setSuccesMessage("")
    }, 5000)
/*
    const personExist = persons.find((person) => person.name === newName)

    if (personExist) {
      const confirmUpdate = window.confirm(
        `${newName} this person exist in the form, replace the old number with a new number?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...personExist, number: newNumber }
        personServices
          .update(personExist.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p =>
              p.id !== personExist.id ? p : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
            setSuccesMessage(`Updated ${returnedPerson.name}'s number`)
            setTimeout(() => setSuccesMessage(null), 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${personExist.name} has already been removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== personExist.id))
          })
      }
      return
    }*/

    const personObject = {
      name: newName,
      number: newNumber
    }

    personServices.create(personObject)
      .then(personBack => {
        setPersons(persons.concat(personBack))
        setNewName('')
        setNewNumber('')
        setSuccesMessage(`Added ${personBack.name}`)
        setTimeout(() => setSuccesMessage(null), 5000)
      })
      .catch(error => {
        const backendError = error.response?.data?.error || 'Error adding person'
        setErrorMessage(backendError)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(persona => persona.id === id)
    const confirmDelete = window.confirm(`Do you want to delete this person in the form? ${person.name}?`)

    if (confirmDelete) {
      personServices
        .remove(id)
        .then(() => {
          setPersons(persons.filter(persona => persona.id !== id))
          setSuccesMessage(`${person.name} has been deleted`)
          setTimeout(() => setSuccesMessage(null), 5000)
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

  const personsToShow = filterText.length > 0
    ? persons.filter(person => person.name && person.name.toLowerCase().includes(filterText.toLowerCase()))
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
        setCountries(response.data)
        setWeather(null)
        if (response.data.length === 1) {
          const capital = response.data[0].capital && response.data[0].capital[0];
          errorWeather(capital)
        }
      } catch (error) {
        setCountries([])
      }
    }

    searchCountries()
  }, [searchItem])

  const errorWeather = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      const weatherResponse = await axios.get(url)
      setWeather(weatherResponse.data)
      setApiError(null);
    } catch (error) {
      setWeather(null);
      setApiError("Failed to fetch weather data")
    }
  }

  const findLenguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(', ')
    } else if (typeof languages === 'object') {
      return Object.values(languages).join(', ')
    } else {
      return 'unknown'
    }
  }

  const countryButton = (country) => {
    setSelectedCountry(country)
    const capital = country.capital && country.capital[0]
    if (capital) errorWeather(capital)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} succesMessage={succesMessage} />

      <Filter filterText={filterText} filterPerson={filterPerson} />

      <h2>Add New</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handlepersonChange={handlepersonChange}
        handleSubmit={addPerson}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={deletePerson} />

      <h1>Find country system</h1>
      <p>
        find countries:
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          placeholder='Enter the country to search'
        />
      </p>

      {countries.length > 10 && <p>You entered too many matches, Please be more specific.</p>}

      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matching countries</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common}>
                {country.name.common}{' '}
                <button onClick={() => countryButton(country)}>Show Data</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h3>{selectedCountry.name.common}</h3>
          <p>Capital: {selectedCountry.capital && selectedCountry.capital[0]}</p>
          <p>Area: {selectedCountry.area}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Language: {selectedCountry.languages && findLenguage(selectedCountry.languages)}</p>
          <img src={selectedCountry.flags.svg} alt={`Flag of ${selectedCountry.name.common}`} width="300" />
        </div>
      )}

      {weather && selectedCountry && (
        <div>
          <h3>Weather in {selectedCountry.capital && selectedCountry.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} km/h</p>
          {weather.weather[0]?.icon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
          )}
        </div>
      )}

      {apiError && <p>{apiError}</p>}

      <Footer />
    </div>
  )
}

export default App
