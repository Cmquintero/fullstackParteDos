import Note from "./components/Note"

const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Footer = (props) => <h3>{props.message}</h3>

const Total = (props) => <h3>Number of exercises {props.total}</h3>
const Midel = (props) =><h3>{props.midel}</h3>

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  )
}


const Course = ({ course,midel }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Midel midel={midel}/>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total total={total} />
      <Footer message={course.text} />
    </div>
  )
}

const App = () => {
  const Midel ="Web Development Curriculum Mario";
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
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
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]
  return (
    <div>
      {courses.map(course => (
        <Course course={course} midel={Midel} />
      ))}
    </div>
  )
}
export default App
