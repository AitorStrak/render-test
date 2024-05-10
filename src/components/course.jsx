const Header = ({name}) => (
    <>
      <h2>{name}</h2>
    </>
    );
    
const Total = ({total}) => {
    const totalExercises = total.reduce((acc, part) => acc + part.exercises, 0);
    return (
    <p>Total de ejercicios: {totalExercises}</p>
    );
};

const Part = ({part}) => (
<p>
    {part.name} {part.exercises}
</p>
);

const Content = ({parts}) => (
<div>
    {parts.map(part => 
    <Part key={part.id} part={part} />
    )}
    <Total total={parts} />      
</div>
);

const Course = ({course}) => (
    <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    </> 
);

const Courses = ({courses}) => (
<>
    {courses.map(course => 
    <Course key={course.id} course={course} />
    )}
</>
);

export default Courses