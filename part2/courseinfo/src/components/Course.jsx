const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => (
  <div>
    {parts.map(part =>
      <Part part = {part} key = {part.id}/>
    )}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p>Number of exercises {props.total}</p>

const Course = ({course}) => {
  
  const totalValue = course.parts.reduce((accumulator, currentObject) => {
    return accumulator + currentObject.exercises;
  }, 0);
  
  return (
    <div>
      <Header course = {course.name}/>
      <Content parts = {course.parts}/>
      <Total total = {totalValue}/>
    </div>
  )
}

export default Course;