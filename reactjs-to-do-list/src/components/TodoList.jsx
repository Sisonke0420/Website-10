import TodoCard from './TodoCard';

export default function TodoList({
  todos,
  filter,
  onUpdateTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  return (
    <ul className="main">
      {todos.length === 0 ? (
        <li className="emptyState">
          <span className="emptyIcon" aria-hidden="true">
            <i className={`fa-solid ${filter === 'completed' ? 'fa-check' : 'fa-mug-hot'}`}></i>
          </span>
          <strong>
            {filter === 'completed'
              ? 'Nothing completed just yet'
              : filter === 'active'
                ? 'You’re all caught up'
                : 'Your list is a blank page'}
          </strong>
          <span>
            {filter === 'completed'
              ? 'Finish a task and it will show up here.'
              : filter === 'active'
                ? 'Enjoy the breathing room, or add another task.'
                : 'Add a task above and make today yours.'}
          </span>
        </li>
      ) : (
        todos.map((todo) => (
          <TodoCard
            key={todo.id}
            todo={todo}
            onUpdate={onUpdateTodo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        ))
      )}
    </ul>
  );
}
