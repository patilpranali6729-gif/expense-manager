import { useMemo, useState } from 'react'

const startingExpenses = []

const emptyForm = {
  title: '',
  amount: '',
  category: 'Food',
  date: new Date().toISOString().slice(0, 10),
}

function ExpenseForm({ onSave, editingExpense, onCancel }) {
  const [form, setForm] = useState(editingExpense || emptyForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !form.title.trim() ||
      !form.amount ||
      Number(form.amount) <= 0 ||
      !form.date
    ) {
      setError('Please enter a title, a valid amount, and a date.')
      return
    }

    onSave({
      ...form,
      title: form.title.trim(),
      amount: Number(form.amount),
    })

    setForm(emptyForm)
    setError('')
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <h2>{editingExpense ? 'Edit expense' : 'Add expense'}</h2>

        {editingExpense && (
          <button
            type="button"
            className="text-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="form-grid">
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Lunch"
          />
        </label>

        <label>
          Amount
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Date
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <button className="primary-button" type="submit">
        {editingExpense ? 'Update expense' : 'Add expense'}
      </button>
    </form>
  )
}

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="empty">
        No expenses match your search.
      </div>
    )
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <article className="expense-item" key={expense.id}>
          <div>
            <h3>{expense.title}</h3>
            <p>
              {expense.category} · {expense.date}
            </p>
          </div>

          <div className="expense-actions">
            <strong>₹{expense.amount.toFixed(2)}</strong>

            <button onClick={() => onEdit(expense)}>
              Edit
            </button>

            <button
              className="danger"
              onClick={() => onDelete(expense.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function App() {
  const [expenses, setExpenses] = useState(startingExpenses)
  const [editingExpense, setEditingExpense] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  function saveExpense(expense) {
    if (editingExpense) {
      setExpenses((current) =>
        current.map((item) =>
          item.id === editingExpense.id
            ? { ...expense, id: item.id }
            : item
        )
      )

      setEditingExpense(null)
      return
    }

    setExpenses((current) => [
      ...current,
      {
        ...expense,
        id: Date.now(),
      },
    ])
  }

  function deleteExpense(id) {
    setExpenses((current) =>
      current.filter((expense) => expense.id !== id)
    )

    if (editingExpense?.id === id) {
      setEditingExpense(null)
    }
  }

  const filteredExpenses = useMemo(() => {
    const text = search.trim().toLowerCase()

    return expenses.filter((expense) => {
      const matchesText = expense.title
        .toLowerCase()
        .includes(text)

      const matchesCategory =
        category === 'All' ||
        expense.category === category

      return matchesText && matchesCategory
    })
  }, [expenses, search, category])

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">PROJECT 03</p>

          <h1>Personal Expense Manager</h1>

          <p className="subtitle">
            A simple React app for keeping track of everyday expenses.
          </p>
        </div>

        <div className="total-card">
          <span>Total spent</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>
      </header>

      <ExpenseForm
        onSave={saveExpense}
        editingExpense={editingExpense}
        onCancel={() => setEditingExpense(null)}
      />

      <section className="card">
        <div className="section-title-row">
          <div>
            <h2>Expenses</h2>

            <p className="muted">
              Search by title or filter by category.
            </p>
          </div>
        </div>

        <div className="filters">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search expenses..."
            aria-label="Search expenses"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            <option>All</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onEdit={setEditingExpense}
          onDelete={deleteExpense}
        />
      </section>

      <footer>
        Personal Expense Manager · React + Vite
      </footer>
    </main>
  )
}

export default App