import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllMenu, setShowAllMenu] = useState(false);

  useEffect(() => {
    const savedNotes = localStorage.getItem('todoNotes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('todoNotes', JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const handleSearchClick = () => {
    document.querySelector('.search-input').focus();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addNote = () => {
    setShowPopup(true);
  };

  const handleAllDone = () => {
    const allDone = notes.every(note => note.completed); 
    const updatedNotes = notes.map(note => ({ ...note, completed: !allDone }));
    setNotes(updatedNotes);
    setShowAllMenu(false);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all notes?')) {
      setNotes([]);
      setShowAllMenu(false);
    }
  };

  const handleApply = () => {
    if (newNoteText.trim() !== '') {
      const newNote = {
        id: Date.now(),
        text: newNoteText.trim(),
        completed: false
      };
      setNotes([...notes, newNote]);
      setNewNoteText('');
      setShowPopup(false);
    }
  };

  const handleCancel = () => {
    setNewNoteText('');
    setShowPopup(false);
  };

  const toggleNote = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const editNote = (id) => {
    const newText = prompt('Edit note:', notes.find(note => note.id === id)?.text);
    if (newText !== null && newText.trim() !== '') {
      setNotes(notes.map(note =>
        note.id === id ? { ...note, text: newText.trim() } : note
      ));
    }
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='container'>
      <h1 className='todo-text'>TODO LIST</h1>

      <div className='search-container'>
        <div className="search-input-wrapper">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className='search-input'
            onChange={handleSearch}
            value={searchTerm}
          />
          <button className="search-icon-btn" onClick={handleSearchClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
          <div className="all-menu-container">
          <button className='all-button' onClick={() => setShowAllMenu(prev => !prev)}>
            <span className="all-text">ALL</span>
            <span className={`arrow-icon ${showAllMenu ? 'open' : ''}`}>▼</span>
          </button>


            {showAllMenu && (
              <div className="all-menu-dropdown">
                <button className="all-menu-item" onClick={handleAllDone}> All Done</button>
                <button className="all-menu-item" onClick={handleDeleteAll} >Delete All</button>
              </div>
            )}
          </div>
      </div>

      <div className='notes-container'>
        {filteredNotes.length === 0 ? (
          <div className='empty-notes'>
            <img src="./detective.svg" alt="No notes" className='detective-icon' />
            <p className='empty-message'>No results found...</p>
          </div>
        ) : (
          filteredNotes.map((note, index) => (
            <React.Fragment key={note.id}>
              <div className='note-item'>
                <div 
                  className={`note-checkbox ${note.completed ? 'checked' : ''}`}
                  onClick={() => toggleNote(note.id)}
                >
                  {note.completed && <span className='checkmark'>✓</span>}
                </div>
                
                <span className={`note-text ${note.completed ? 'completed' : ''}`}>
                  {note.text}
                </span>
                
                <div className='note-options'>
                  <button className='edit-btn' onClick={() => editNote(note.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CDCDCD" strokeWidth="1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className='delete-btn' onClick={() => deleteNote(note.id)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CDCDCD" strokeWidth="1">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>

              {index < filteredNotes.length - 1 && <div className='note-separator'></div>}
            </React.Fragment>
          ))
        )}
      </div>

      <button className='add-button-bottom' onClick={addNote}>
        +
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">NEW NOTE</h2>
            <input 
              type="text"
              placeholder="Input your note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="popup-input"
              autoFocus
            />
            <div className="popup-buttons">
              <button className="cancel-btn" onClick={handleCancel}>
                CANCEL
              </button>
              <button className="apply-btn" onClick={handleApply}>
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
