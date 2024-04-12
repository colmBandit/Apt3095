import { useEffect, useState } from 'react';
import './App.css';
import Header from './component/Header';
import axios from 'axios';

const App = () => {
  const [editMode, setEditMode] = useState(false);
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState('');

  const showTodos = async () => {
    try {
      const { data } = await axios.get('/api/show/todos');
      setList(data);
    } catch (error) {
      console.log(error);
    }
  }

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const add = await axios.post('/api/create/list', { title, dueDate, completed });
      if (add.status === 200) {
        setTitle('');
        setDueDate('');
        setCompleted(false);
        showTodos();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTodo = async (id) => {
    try {
      const todoDelete = await axios.delete(`/api/delete/todo/${id}`);
      if (todoDelete.status === 200) {
        showTodos();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const showSingleTodo = async (id) => {
    setEditMode(true);
    try {
      const { data } = await axios.get(`/api/todo/${id}`);
      setTitle(data.title);
      setDueDate(data.dueDate);
      setCompleted(data.completed);
      setUserId(data.id);
    } catch (error) {
      console.log(error);
    }
  }

  const editTodo = async (e) => {
    e.preventDefault();
    try {
      const edit = await axios.put(`/api/update/todo/${userId}`, { title, dueDate, completed });
      if (edit.status === 200) {
        setEditMode(false);
        setTitle('');
        setDueDate('');
        setCompleted(false);
        showTodos();
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    showTodos();
  }, []);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Todo List</h3>
              </div>
              <div className="card-body">
                <form onSubmit={editMode ? editTodo : addTodo}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" type="text" id="title" placeholder="Title" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                    <input onChange={(e) => setDueDate(e.target.value)} value={dueDate} className="form-control" type="date" id="dueDate" />
                  </div>
                  <div className="mb-3 form-check">
                    <input onChange={(e) => setCompleted(e.target.checked)} checked={completed} type="checkbox" className="form-check-input" id="completed" />
                    <label className="form-check-label" htmlFor="completed">Completed</label>
                  </div>
                  {
                    editMode ?
                      <button type='submit' className='btn btn-primary'>Edit</button>
                      :
                      <button type='submit' className='btn btn-success'>Add</button>
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4 justify-content-center">
          <div className="col-md-8">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Completed</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  list && list.map(d => (
                    <tr key={d.id}>
                      <th scope="row">{d.id}</th>
                      <td>{d.title}</td>
                      <td>{d.dueDate}</td>
                      <td>{d.completed ? 'Yes' : 'No'}</td>
                      <td>
                        <i onClick={() => showSingleTodo(d.id)} className="fa-solid fa-pen-to-square" style={{ color: "green", cursor: "pointer", marginRight: "10px" }} ></i>
                        <i onClick={() => deleteTodo(d.id)} style={{ color: "red", cursor: "pointer" }} className="fa-solid fa-trash-can"></i>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
