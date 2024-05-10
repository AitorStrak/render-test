import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Notification from "./components/Notification";

const Numbers = ({ person, deleteNumber }) => (
  <p>
    {person.name} {person.number}
    <button type="submit" onClick={() => deleteNumber(person.id)}>
      Borrar
    </button>
  </p>
);

const Filter = ({ newFilter, handleFilter }) => (
  <div>
    Búsqueda de contactos:{" "}
    <input
      placeholder="Filtrar contactos"
      value={newFilter}
      onChange={handleFilter}
    />
  </div>
);

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addNumber,
}) => (
  <form onSubmit={addNumber}>
    <h2>Añadir nuevo número</h2>
    <div>
      Nombre:{" "}
      <input
        placeholder="Nombre de contacto"
        value={newName}
        onChange={handleNameChange}
      />
    </div>
    <div>
      Número:{" "}
      <input
        placeholder="Número de teléfono"
        value={newNumber}
        onChange={handleNumberChange}
      />
    </div>
    <button type="submit">Añadir</button>
  </form>
);

const Persons = ({ filterName, deleteNumber }) => (
  <>
    <h2>Contactos</h2>
    <div>
      {filterName.map((person) => (
        <Numbers key={person.id} person={person} deleteNumber={deleteNumber} />
      ))}
    </div>
  </>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setFilter] = useState("");
  const [message, setMessage] = useState('');
  const [messageError, setError] = useState('');

  useEffect(() => {
    personsService.getAll().then((initialPerson) => {
      setPersons(initialPerson);
    });
  }, []);

  const deleteNumber = (id) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres borrar este contacto?"
    );
    if (isConfirmed) {
      personsService
        .delet(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.log("Error borrando el contacto: ", error);
        });
    }
  };

  const showNotification = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const showError = (messageError) => {
    setError(messageError);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const addNumber = (e) => {
    e.preventDefault();

    const nameAdded = persons.map((person) => person.name).includes(newName);
    const numberAdded = persons
      .map((person) => person.number)
      .includes(newNumber);

    const numberObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString(),
    };

    if (!nameAdded && !numberAdded) {
      personsService
        .create(numberObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          showNotification(
            `Contacto ${numberObject.name} agregado`
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          showError(`Error al agregar el contacto ${numberObject.name}`);
        });
    } else {
      const isConfirmed = window.confirm(
        "El nombre ya existe en la agenda. ¿Quieres reemplazar el número de teléfono?"
      );
      if (!isConfirmed) {
        return;
      } else {
        const existingPerson = persons.find(
          (person) => person.name === newName
        );
        const updatedPerson = { ...existingPerson, number: newNumber };
        personsService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            showNotification(
              `El número del contacto ${numberObject.name} ha sido modificado`
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            showError(`Error al actualizar el contacto ${numberObject.name}`);
          });
      };
    };
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
  };

  const filterName = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLocaleLowerCase())
  );

  return (
    <>
      <h2>Agenda telefónica</h2>
      <Notification message={message} messageError={messageError} />
      <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addNumber={addNumber}
      />
      <Persons filterName={filterName} deleteNumber={deleteNumber} />
    </>
  );
};

export default App;
