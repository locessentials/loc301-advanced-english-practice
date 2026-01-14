# Eng301: Advanced English Practice Course Site

A lean, data-driven course website system built with vanilla JavaScript, HTML, and CSS.

## Architecture

### File Structure
```
/
├── index.html              # Homepage
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── content-loader.js   # Loads JSON and populates templates
│   └── quiz-handler.js     # Interactive elements (activities, quiz)
├── data/
│   ├── week1.json          # Week 1 content
│   ├── week2.json          # Week 2 content (add as needed)
│   └── ...
└── templates/
    └── week-template.html  # Single template for all week pages
```

### How It Works

**1. Single Template, Multiple Pages**
- One HTML template (`week-template.html`) handles all page types
- URL parameters control what displays: `?week=1&page=intro`
- JavaScript shows/hides the appropriate section

**2. Data-Driven Content**
- Each week has a JSON file in `/data/`
- JavaScript fetches the JSON and populates the template
- Easy to update content without touching HTML

**3. Page Types**
Each week has 5 page types accessed via URL parameters:
- `page=intro` - Lecture content + navigation buttons
- `page=give-it-a-try` - 3-5 confidence-building activities
- `page=exercises` - 8-12 practice exercises
- `page=quiz` - 15-question quiz (3 shown at random)
- `page=assignment` - Weekly assignment with peer review info

## Adding New Weeks

1. **Copy `week1.json`** to create `week2.json`, `week3.json`, etc.
2. **Update the content** in the JSON file
3. **Add link** to homepage (`index.html`)

That's it! The template automatically handles the new week.

## JSON Structure

```json
{
  "week": 1,
  "title": "Week Title",
  "breadcrumb": "Short title for navigation",
  "introduction": {
    "overview": "What students will learn",
    "objectives": ["Objective 1", "Objective 2"]
  },
  "lecture": {
    "sections": [
      {
        "heading": "Section Title",
        "content": "Teaching content (can include HTML)",
        "example": "Example with context"
      }
    ]
  },
  "giveItATry": {
    "instructions": "Guidance for students",
    "activities": [
      {
        "type": "fill-blank|choice|rewrite",
        "prompt": "The question or task",
        "answer": "Expected answer",
        "hint": "Optional hint",
        "explanation": "Why this is correct"
      }
    ]
  },
  "exercises": {
    "instructions": "Guidance for students",
    "items": [
      {
        "question": "The question",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct": "Option 2",
        "explanation": "Why this is correct"
      }
    ]
  },
  "quiz": {
    "instructions": "Quiz instructions",
    "questions": [
      // Same structure as exercises
      // Add 15+ questions; 3 are randomly selected
    ]
  },
  "assignment": {
    "title": "Assignment Title",
    "instructions": "What students should do",
    "options": [
      {
        "title": "Option 1 Title",
        "prompt": "The task description",
        "deliverable": "What to submit"
      }
    ],
    "peerReview": {
      "instructions": "How to review",
      "criteria": ["Criterion 1", "Criterion 2"],
      "format": "Review format description"
    }
  }
}
```

## Interactive Features

**Give It a Try**
- Students type answers
- Click "Check Answer" for feedback
- Flexible checking (not exact match required)

**Exercises**
- Click an option to select
- Immediate visual feedback (green/red)
- Explanation appears below

**Quiz**
- 3 random questions from the pool
- Select answers (no immediate feedback)
- Click "Submit Quiz" 
- If all correct: confetti + success message
- If any wrong: retry with feedback

**Assignment**
- Click to select an option (visual only)
- Peer review guidelines displayed

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --primary: #1a472a;      /* Main brand color */
  --accent: #d4af37;        /* Highlight color */
  --bg: #fdfcf8;            /* Page background */
  --card-bg: #ffffff;       /* Card background */
}
```

### Fonts
Currently using:
- **Headings:** Archivo (clean, modern sans-serif)
- **Body:** Crimson Pro (readable, scholarly serif)

Change in the `@import` at the bottom of `styles.css`

### Quiz Behavior
- Number of questions shown: Line 15 in `quiz` rendering (currently 3)
- Confetti: Edit `createConfetti()` function in `quiz-handler.js`

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Requires JavaScript enabled.

## No Build Process Required

Pure vanilla JavaScript - just open `index.html` in a browser or host the files on any web server. No npm, webpack, or compilation needed.

## Notes

- **Breadcrumbs** auto-generate from current week/page
- **Navigation** always provides "Back to Introduction" on activity pages
- **Responsive** design works on mobile/tablet/desktop
- **Accessibility** uses semantic HTML and ARIA where helpful
