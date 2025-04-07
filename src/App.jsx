import Note from "./components/Note"

const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)
const Footer = (props) => <h2>{props.message}</h2>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}
const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Footer message={course.text} />
    </div>
  )
}
const App = () => {
  const course = {
    id: 1,
    text: "hi i'm Carlos Mario Quintero I use full Stack open i be so happy to understand more to develope",
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3,

      }
    ]
  }

  return <Course course={course} />
}

export default App