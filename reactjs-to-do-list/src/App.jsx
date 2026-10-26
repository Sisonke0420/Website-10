import { useEffect, useMemo, useRef, useState } from 'react';
import Calendar from './components/Calendar';
import DateDisplay from './components/DateDisplay';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

const initialTodos = [
	{ id: 1, text: 'Learn React', completed: false },
	{ id: 2, text: 'Learn React Router', completed: false },
	{ id: 3, text: 'Learn React Redux', completed: false },
];
const storageKey = 'daily-list-todos';

function getDateKey(date = new Date()) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
	].join('-');
}

function loadTodos() {
	try {
		const savedTodos = window.localStorage.getItem(storageKey);
		if (!savedTodos) {
			return initialTodos.map((todo) => ({ ...todo, date: getDateKey() }));
		}

		const parsedTodos = JSON.parse(savedTodos);
		if (
			Array.isArray(parsedTodos) &&
			parsedTodos.every(
				(todo) =>
					Number.isInteger(todo.id) &&
					typeof todo.text === 'string' &&
					typeof todo.completed === 'boolean' &&
					(todo.date === undefined || /^\d{4}-\d{2}-\d{2}$/.test(todo.date)),
			)
		) {
			return parsedTodos.map((todo) => ({
				...todo,
				date: todo.date || getDateKey(),
			}));
		}

		console.error('Saved to-dos are invalid; loading the starter list instead.');
	} catch (error) {
		console.error('Could not load saved to-dos.', error);
	}

	return initialTodos;
}

function App() {
	const [todos, setTodos] = useState(loadTodos);
	const [filter, setFilter] = useState('all');
	const [view, setView] = useState('list');
	const [selectedDate, setSelectedDate] = useState(getDateKey);
	const nextTodoId = useRef(Math.max(0, ...todos.map((todo) => todo.id)) + 1);
	const selectedTodos = useMemo(
		() => todos.filter((todo) => todo.date === selectedDate),
		[todos, selectedDate],
	);
	const completedCount = selectedTodos.filter((todo) => todo.completed).length;
	const remainingCount = selectedTodos.length - completedCount;
	const progress = selectedTodos.length
		? Math.round((completedCount / selectedTodos.length) * 100)
		: 0;
	const formattedSelectedDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
		undefined,
		{ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
	);

	useEffect(() => {
		try {
			window.localStorage.setItem(storageKey, JSON.stringify(todos));
		} catch (error) {
			console.error('Could not save to-dos.', error);
		}
	}, [todos]);

	const visibleTodos = useMemo(
		() =>
			selectedTodos.filter((todo) => {
				if (filter === 'active') return !todo.completed;
				if (filter === 'completed') return todo.completed;
				return true;
			}),
		[selectedTodos, filter],
	);

	function addTodo(text) {
		setTodos((currentTodos) => [
			...currentTodos,
			{ id: nextTodoId.current++, text, completed: false, date: selectedDate },
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

	function clearCompleted() {
		setTodos((currentTodos) =>
			currentTodos.filter((todo) => todo.date !== selectedDate || !todo.completed),
		);
	}

	return (
		<main className="appShell">
			<header className="topbar">
				<a className="brand" href="/" aria-label="Daymark home">
					<span className="brandMark" aria-hidden="true">
						<i className="fa-solid fa-check"></i>
					</span>
					<span>daymark</span>
				</a>
				<span className="topbarNote">Make today count</span>
			</header>

			<section className="planner" aria-labelledby="pageTitle">
				<div className="welcome">
					<div>
						<p className="eyebrow">YOUR PERSONAL DAILY PLANNER</p>
						<h1 id="pageTitle">A little progress, every day.</h1>
						<p className="welcomeText">Keep your focus on what matters today.</p>
					</div>
					<DateDisplay />
				</div>

				<section className="progressCard" aria-label="Daily progress">
					<div className="progressHeading">
						<div>
							<p className="sectionLabel">
								{selectedDate === getDateKey() ? "TODAY'S PROGRESS" : 'DAILY PROGRESS'}
							</p>
							<p className="progressSummary"><strong>{completedCount}</strong> of {selectedTodos.length} tasks complete</p>
						</div>
						<span className="progressPercent">{progress}%</span>
					</div>
					<div
						className="progressTrack"
						role="progressbar"
						aria-label="Tasks completed"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={progress}
					>
						<span style={{ width: `${progress}%` }} />
					</div>
					<div className="taskStats">
						<span><i className="fa-regular fa-circle" aria-hidden="true"></i>{remainingCount} left to do</span>
						<span><i className="fa-regular fa-circle-check" aria-hidden="true"></i>{completedCount} completed</span>
					</div>
				</section>

				<section className="tasksSection" aria-labelledby="tasksTitle">
					<div className="tasksHeading">
						<div>
							<p className="sectionLabel">{view === 'calendar' ? 'YOUR SCHEDULE' : 'YOUR LIST'}</p>
							<h2 id="tasksTitle">{selectedDate === getDateKey() ? "Today's tasks" : formattedSelectedDate}</h2>
						</div>
						<span className="taskCount">{remainingCount} remaining</span>
					</div>

					<div className="viewTabs" role="group" aria-label="Choose planner view">
						<button
							type="button"
							className={view === 'list' ? 'viewTab selected' : 'viewTab'}
							aria-pressed={view === 'list'}
							onClick={() => setView('list')}
						>
							<i className="fa-solid fa-list-check" aria-hidden="true"></i> List
						</button>
						<button
							type="button"
							className={view === 'calendar' ? 'viewTab selected' : 'viewTab'}
							aria-pressed={view === 'calendar'}
							onClick={() => setView('calendar')}
						>
							<i className="fa-regular fa-calendar" aria-hidden="true"></i> Calendar
						</button>
					</div>

					{view === 'calendar' && (
						<Calendar
							selectedDate={selectedDate}
							todos={todos}
							onSelectDate={setSelectedDate}
						/>
					)}

					<div className="selectedDateLabel">
						<i className="fa-regular fa-calendar" aria-hidden="true"></i>
						<span>Planning for <strong>{formattedSelectedDate}</strong></span>
					</div>
					<TodoInput onAddTodo={addTodo} />

					<div className="listToolbar">
						<div className="filterTabs" role="group" aria-label="Filter tasks">
							{['all', 'active', 'completed'].map((option) => (
								<button
									key={option}
									type="button"
									className={filter === option ? 'filterTab selected' : 'filterTab'}
									aria-pressed={filter === option}
									onClick={() => setFilter(option)}
								>
									{option[0].toUpperCase() + option.slice(1)}
								</button>
							))}
						</div>
						{completedCount > 0 && (
							<button className="clearButton" type="button" onClick={clearCompleted}>
								Clear completed
							</button>
						)}
					</div>

					<TodoList
						todos={visibleTodos}
						filter={filter}
						onUpdateTodo={updateTodo}
						onToggleTodo={toggleTodo}
						onDeleteTodo={deleteTodo}
					/>
				</section>
				<footer className="footerNote">One thing at a time. You've got this.</footer>
			</section>
		</main>
	);
}

export default App;
