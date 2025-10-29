// Simple React app for Studie Dashboard

const { useState, useEffect, useMemo } = React;

function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString();
}

function App() {
  // start met lege lijst en laad vanaf server
  const [tasks, setTasks] = useState([]);

  const [text, setText] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState('normaal');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);

  // helper: basis API endpoint (relatief pad)
  const API = './api.php';

  async function fetchTasks() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // server geeft done meestal als 0/1, zorg voor booleans
      setTasks(data.map(t => ({ ...t, done: t.done ? true : false })));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  function addOrUpdate(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const payload = { text: text.trim(), due: due || null, priority };
    if (editingId) {
      // update via PUT
      fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload })
      }).then(() => {
        setEditingId(null);
        fetchTasks();
      }).catch(console.error);
    } else {
      // create via POST
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => fetchTasks()).catch(console.error);
    }
    setText(''); setDue(''); setPriority('normaal');
  }

  function toggleTask(id) {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    fetch(API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, done: !t.done })
    }).then(() => fetchTasks()).catch(console.error);
  }

  function removeTask(id) {
    fetch(API + '?id=' + encodeURIComponent(id), { method: 'DELETE' })
      .then(() => fetchTasks()).catch(console.error);
  }

  function startEdit(t) {
    setEditingId(t.id);
    setText(t.text);
    setDue(t.due || '');
    setPriority(t.priority || 'normaal');
  }

  function clearCompleted() { setTasks(prev => prev.filter(t => !t.done)); }
  // clearCompleted: verwijder elk voltooid item op de server, daarna ververs
  function clearCompletedServer() {
    const completed = tasks.filter(t => t.done);
    Promise.all(completed.map(t => fetch(API + '?id=' + encodeURIComponent(t.id), { method: 'DELETE' })))
      .then(() => fetchTasks()).catch(console.error);
  }

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'active') return !t.done;
      if (filter === 'completed') return t.done;
      return true;
    }).sort((a,b) => {
      const pr = { hoog: 0, normaal: 1, laag: 2 };
      return pr[a.priority] - pr[b.priority];
    });
  }, [tasks, filter]);

  return (
    <div className="dashboard">
      <div className="header">
        <div>
          <h2>Studie Dashboard</h2>
          <div className="small">Organiseer je taken, stel prioriteiten en houd voortgang bij</div>
        </div>
        <div className="small">Taken: {tasks.length}</div>
      </div>

      <form className="add-task" onSubmit={addOrUpdate}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Nieuwe taak of bewerk bestaande..." />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="hoog">Hoog</option>
          <option value="normaal">Normaal</option>
          <option value="laag">Laag</option>
        </select>
        <button type="submit">{editingId ? 'Opslaan' : 'Toevoegen'}</button>
      </form>

      <div className="controls">
        <button className={"control-btn " + (filter === 'all' ? 'active' : '')} onClick={() => setFilter('all')}>Alles</button>
        <button className={"control-btn " + (filter === 'active' ? 'active' : '')} onClick={() => setFilter('active')}>Actief</button>
        <button className={"control-btn " + (filter === 'completed' ? 'active' : '')} onClick={() => setFilter('completed')}>Voltooid</button>
        <div style={{flex:1}} />
        <button className="control-btn" onClick={clearCompletedServer}>Wis Voltooid</button>
      </div>

      <ul className="tasks">
        {filtered.length === 0 && <div className="empty">Geen taken om weer te geven</div>}
        {filtered.map(task => (
          <li key={task.id}>
            <div className="task-left">
              <div className={"check " + (task.done ? 'checked' : '')} onClick={() => toggleTask(task.id)}>
                {task.done ? '\u2713' : ''}
              </div>
              <div>
                <div className="task-title" style={{textDecoration: task.done ? 'line-through' : 'none'}}>{task.text}</div>
                <div className="task-meta">{task.priority} • {task.due ? formatDate(task.due) : 'Geen deadline'}</div>
              </div>
            </div>
            <div className="task-actions">
              <button onClick={() => startEdit(task)}>Bewerk</button>
              <button onClick={() => removeTask(task.id)}>Verwijder</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="footer">
        <div>{tasks.filter(t => !t.done).length} resterend</div>
        <div className="small">Alle data lokaal opgeslagen in je browser</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));