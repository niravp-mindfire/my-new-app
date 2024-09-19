import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { IconButton, Slider, Popover } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import CommentIcon from '@mui/icons-material/Comment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import './App.css'; // For custom styling

const CustomEditor = () => {
  const [editorState, setEditorState] = useState('');
  const [selection, setSelection] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rateValue, setRateValue] = useState(50); // Initial rate slider value
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current.getEditor();

    // Disable default toolbar
    quill.getModule('toolbar').container.style.display = 'none';

    // Handle text selection
    quill.on('selection-change', (range) => {
      if (range && range.length > 0) {
        const { left, top } = quill.getBounds(range.index, range.length);
        setSelection(range);
        setAnchorEl({
          x: left,
          y: top,
        });
      } else {
        setSelection(null);
        setAnchorEl(null);
      }
    });

    // Add custom functionality for paragraphs
    quill.on('text-change', () => {
      const editor = document.querySelector('.ql-editor');
      const paragraphs = editor.querySelectorAll('p');

      paragraphs.forEach((paragraph) => {
        if (!paragraph.classList.contains('paragraph-marker')) {
          paragraph.classList.add('paragraph-marker');
        }
      });
    });
  }, []);

  // Handle undo
  const handleUndo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.undo();
  };

  // Handle redo
  const handleRedo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.redo();
  };

  // Toggle bold on selected text
  const toggleBold = () => {
    const quill = quillRef.current.getEditor();
    quill.format('bold', !quill.getFormat().bold);
  };

  // Handle rate slider change
  const handleRateChange = (event, newValue) => {
    setRateValue(newValue);
    const quill = quillRef.current.getEditor();
    const colorValue = `hsl(${newValue}, 100%, 50%)`;
    quill.formatText(selection.index, selection.length, 'background', colorValue);
  };

  // Add comment (optional functionality)
  const addComment = () => {
    const comment = prompt('Enter your comment:');
    if (comment) {
      console.log('Comment added:', comment);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '20px', backgroundColor: '#1d1d1d' }}>
      <ReactQuill
        ref={quillRef}
        value={editorState}
        onChange={setEditorState}
        modules={{
          history: {
            delay: 1000,
            maxStack: 100,
          },
        }}
        formats={['bold']}
        theme="snow"
      />

      {selection && (
        <Popover
          open={Boolean(anchorEl)}
          anchorReference="anchorPosition"
          anchorPosition={anchorEl ? { top: anchorEl.y + 50, left: anchorEl.x } : undefined}
          onClose={() => setAnchorEl(null)}
        >
          <div style={{ display: 'flex', padding: '10px' }}>
            <IconButton onClick={handleUndo}>
              <UndoIcon />
            </IconButton>
            <IconButton onClick={handleRedo}>
              <RedoIcon />
            </IconButton>
            <IconButton onClick={toggleBold}>
              <FormatBoldIcon />
            </IconButton>
            <IconButton>
              <RateReviewIcon />
            </IconButton>
            <Slider
              value={rateValue}
              onChange={handleRateChange}
              aria-labelledby="rate-slider"
              style={{ width: '100px', marginLeft: '10px' }}
              min={0}
              max={100}
            />
            <IconButton onClick={addComment}>
              <CommentIcon />
            </IconButton>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default CustomEditor;
