import { useState } from 'react';

export default function TodoInput({ onAddTodo }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    onAddTodo(trimmedText);
    setText('');
  }

  return (
    <form className="todoInput" onSubmit={handleSubmit}>
      <span className="inputIcon" aria-hidden="true">
        <i className="fa-solid fa-plus"></i>
      </span>
      <input
        type="text"
        placeholder="What would you like to get done?"
        aria-label="New to-do"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">
        Add task <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </form>
  );
}