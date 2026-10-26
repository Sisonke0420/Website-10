import { useMemo, useState } from 'react';

function toDateKey(date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, '0'),
		String(date.getDate()).padStart(2, '0'),
	].join('-');
}

function formatMonth(date) {
	return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function Calendar({ selectedDate, todos, onSelectDate }) {
	const [visibleMonth, setVisibleMonth] = useState(() => {
		const [year, month] = selectedDate.split('-').map(Number);
		return new Date(year, month - 1, 1);
	});
	const todayKey = toDateKey(new Date());

	const days = useMemo(() => {
		const year = visibleMonth.getFullYear();
		const month = visibleMonth.getMonth();
		const firstDayOffset = (new Date(year, month, 1).getDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const dateKeys = Array(firstDayOffset).fill(null);

		for (let day = 1; day <= daysInMonth; day += 1) {
			dateKeys.push(toDateKey(new Date(year, month, day)));
		}

		return dateKeys;
	}, [visibleMonth]);

	const taskCounts = useMemo(
		() => todos.reduce((counts, todo) => {
			counts[todo.date] = (counts[todo.date] || 0) + 1;
			return counts;
		}, {}),
		[todos],
	);

	function changeMonth(offset) {
		setVisibleMonth((currentMonth) =>
			new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
		);
	}

	function goToToday() {
		const today = new Date();
		setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
		onSelectDate(todayKey);
	}

	return (
		<section className="calendarCard" aria-label="Plan by date">
			<div className="calendarHeader">
				<div>
					<p className="sectionLabel">PLAN AHEAD</p>
					<h3>{formatMonth(visibleMonth)}</h3>
				</div>
				<div className="calendarControls">
					<button type="button" onClick={goToToday} className="todayButton">
						Today
					</button>
					<button
						type="button"
						className="monthButton"
						aria-label="Previous month"
						onClick={() => changeMonth(-1)}
					>
						<i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
					</button>
					<button
						type="button"
						className="monthButton"
						aria-label="Next month"
						onClick={() => changeMonth(1)}
					>
						<i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
					</button>
				</div>
			</div>
			<div className="calendarGrid" role="grid" aria-label={formatMonth(visibleMonth)}>
				{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
					<span className="calendarWeekday" role="columnheader" key={day}>
						{day}
					</span>
				))}
				{days.map((dateKey, index) => {
					if (!dateKey) {
						return <span className="calendarBlank" role="gridcell" key={`blank-${index}`} />;
					}

					const dayNumber = Number(dateKey.slice(-2));
					const isSelected = selectedDate === dateKey;
					const hasTasks = Boolean(taskCounts[dateKey]);
					const className = [
						'calendarDay',
						isSelected && 'selected',
						dateKey === todayKey && 'today',
					]
						.filter(Boolean)
						.join(' ');

					return (
						<button
							type="button"
							className={className}
							role="gridcell"
							aria-pressed={isSelected}
							aria-label={`${new Date(`${dateKey}T12:00:00`).toLocaleDateString(undefined, {
								weekday: 'long',
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}${hasTasks ? `, ${taskCounts[dateKey]} planned ${taskCounts[dateKey] === 1 ? 'task' : 'tasks'}` : ''}`}
							key={dateKey}
							onClick={() => onSelectDate(dateKey)}
						>
							<span>{dayNumber}</span>
							{hasTasks && <span className="calendarTaskDot" aria-hidden="true" />}
						</button>
					);
				})}
			</div>
			<p className="calendarHint">
				<i className="fa-solid fa-circle" aria-hidden="true"></i>
				Dots mark days with plans
			</p>
		</section>
	);
}
