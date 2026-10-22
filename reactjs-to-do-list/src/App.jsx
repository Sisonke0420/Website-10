import { useRef, useState } from 'react';
import DateDisplay from './components/DateDisplay';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

const initialTodos = [
	{ id: 1, text: 'Learn React', completed: false },
	{ id: 2, text: 'Learn React Router', completed: false },
	{ id: 3, text: 'Learn React Redux', completed: false },
];

function App() {
	const [todos, setTodos] = useState(initialTodos);
	const nextTodoId = useRef(initialTodos.length + 1);

	function addTodo(text) {
		setTodos((currentTodos) => [
			...currentTodos,
			{ id: nextTodoId.current++, text, completed: false },
		]);
	}

	function updateTodo(id, text) {
		setTodos((currentTodos) =>
			currentTodos.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
		);
	}

	function toggleTodo(id) {
		setTodos((currentTodos) =>
			currentTodos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo,
			),
		);
	}

	function deleteTodo(id) {
		setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
	}

	return (
		<>
			<DateDisplay />
			<TodoInput onAddTodo={addTodo} />
			<TodoList
				todos={todos}
				onUpdateTodo={updateTodo}
				onToggleTodo={toggleTodo}
				onDeleteTodo={deleteTodo}
			/>
		</>
	);
}

export default App;
