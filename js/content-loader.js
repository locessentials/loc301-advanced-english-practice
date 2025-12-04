// Content Loader - Fetches JSON and populates templates
class ContentLoader {
  constructor() {
    this.params = new URLSearchParams(window.location.search);
    this.week = this.params.get('week') || '1';
    this.page = this.params.get('page') || 'intro';
    this.data = null;
  }

  async loadData() {
    try {
      const response = await fetch(`../data/week${this.week}.json`);
      this.data = await response.json();
      return this.data;
    } catch (error) {
      console.error('Error loading week data:', error);
      return null;
    }
  }

  renderBreadcrumbs() {
    const pageNames = {
      'intro': 'Introduction',
      'give-it-a-try': 'Give It a Try',
      'exercises': 'Exercises',
      'quiz': 'Quiz',
      'assignment': 'Assignment',
      'conclusion': 'Conclusions'
    };

    const breadcrumbsDiv = document.getElementById('breadcrumbs');
    if (!breadcrumbsDiv) return;

    const pageName = pageNames[this.page] || this.page;
    
    breadcrumbsDiv.innerHTML = `
      <a href="../index.html">Home</a>
      <span>/</span>
      <a href="?week=${this.week}&page=intro">${this.data.breadcrumb}</a>
      <span>/</span>
      <span>${pageName}</span>
    `;
  }

  renderIntroPage() {
    const { title, introduction, lecture } = this.data;

    document.getElementById('page-title').textContent = title;

    // Render introduction
    const introSection = document.getElementById('intro-content');
    introSection.innerHTML = `
      <h2>This Week's Focus</h2>
      <p>${introduction.overview}</p>
      <ul class="objectives">
        ${introduction.objectives.map(obj => `<li>${obj}</li>`).join('')}
      </ul>
    `;

    // Render lecture sections
    const lectureContent = document.getElementById('lecture-content');
    lectureContent.innerHTML = lecture.sections.map(section => `
      <div class="lecture-section">
        <h3>${section.heading}</h3>
        <p>${section.content}</p>
        <div class="example">${section.example}</div>
      </div>
    `).join('');

    // Render navigation buttons
    document.getElementById('nav-buttons').innerHTML = `
      <a href="?week=${this.week}&page=give-it-a-try" class="btn">Give It a Try</a>
      <a href="?week=${this.week}&page=exercises" class="btn">Exercises</a>
      <a href="?week=${this.week}&page=quiz" class="btn">Take the Quiz</a>
      <a href="?week=${this.week}&page=assignment" class="btn">View Assignment</a>
      <a href="?week=${this.week}&page=conclusion" class="btn">Week Completed!</a>
    `;
  }

  renderGiveItATry() {
    const { title, giveItATry } = this.data;
    
    document.getElementById('page-title').textContent = `${title} - Give It a Try`;
    
    const container = document.getElementById('activities-container');
    container.innerHTML = `
      <p><em>${giveItATry.instructions}</em></p>
      ${giveItATry.activities.map((activity, index) => `
        <div class="activity" data-index="${index}">
          <div class="activity-prompt">${index + 1}. ${activity.prompt}</div>
          ${activity.hint ? `<div class="hint">💡 ${activity.hint}</div>` : ''}
          <textarea id="answer-${index}" placeholder="Your answer..."></textarea>
          <button class="btn btn-primary" onclick="checkAnswer(${index})">Check Answer</button>
          <div id="feedback-${index}" class="answer-feedback"></div>
        </div>
      `).join('')}
    `;

    // Render navigation buttons
    const navButtons = document.querySelector('#give-it-a-try-page .nav-buttons');
    if (navButtons) {
      navButtons.innerHTML = `
        <a href="?week=${this.week}&page=intro" class="btn">← Back to Introduction</a>
        <a href="?week=${this.week}&page=exercises" class="btn btn-primary">Next: Exercises →</a>
      `;
    }

    // Store activities data for checking
    window.activitiesData = giveItATry.activities;
  }

  renderExercises() {
    const { title, exercises } = this.data;
    
    document.getElementById('page-title').textContent = `${title} - Exercises`;
    
    const container = document.getElementById('exercises-container');
    container.innerHTML = `
      <p><em>${exercises.instructions}</em></p>
      ${exercises.items.map((exercise, index) => `
        <div class="activity">
          <div class="activity-prompt">${index + 1}. ${exercise.question}</div>
          <ul class="exercise-options" data-exercise="${index}">
            ${exercise.options.map((option, optIndex) => `
              <li data-option="${optIndex}" onclick="selectOption(${index}, ${optIndex}, '${exercise.correct}')">${option}</li>
            `).join('')}
          </ul>
          <div id="explanation-${index}" class="explanation"></div>
        </div>
      `).join('')}
    `;

    // Render navigation buttons
    const navButtons = document.querySelector('#exercises-page .nav-buttons');
    if (navButtons) {
      navButtons.innerHTML = `
        <a href="?week=${this.week}&page=give-it-a-try" class="btn">← Back to Give It a Try</a>
        <a href="?week=${this.week}&page=quiz" class="btn btn-primary">Next: Take the Quiz →</a>
      `;
    }

    window.exercisesData = exercises.items;
  }

  renderQuiz() {
    const { title, quiz } = this.data;
    
    document.getElementById('page-title').textContent = `${title} - Quiz`;
    
    const container = document.getElementById('quiz-container');
    
    // Shuffle and pick 3 random questions
    const shuffled = [...quiz.questions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, 3);
    
    container.innerHTML = `
      <div class="card">
        <p><em>${quiz.instructions}</em></p>
        <div id="quiz-questions">
          ${selectedQuestions.map((q, index) => `
            <div class="quiz-question">
              <div class="quiz-number">Question ${index + 1} of 3</div>
              <div class="activity-prompt">${q.question}</div>
              <ul class="exercise-options" data-quiz="${index}">
                ${q.options.map((option, optIndex) => `
                  <li data-option="${optIndex}" onclick="selectQuizOption(${index}, ${optIndex})">${option}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary" onclick="submitQuiz()">Submit Quiz</button>
        <div id="quiz-result" class="quiz-result"></div>
      </div>
    `;

    // Render navigation buttons
    const navButtons = document.querySelector('#quiz-page .nav-buttons');
    if (navButtons) {
      navButtons.innerHTML = `
        <a href="?week=${this.week}&page=exercises" class="btn">← Back to Exercises</a>
        <a href="?week=${this.week}&page=assignment" class="btn btn-primary">Next: View the Assignment →</a>
      `;
    }

    window.quizQuestions = selectedQuestions;
    window.quizAnswers = {};
  }

  renderAssignment() {
    const { title, assignment } = this.data;
    
    document.getElementById('page-title').textContent = `${title} - Assignment`;
    
    const container = document.getElementById('assignment-container');
    container.innerHTML = `
      <div class="card">
        <h2>${assignment.title}</h2>
        <p><em>${assignment.instructions}</em></p>
        
        <div id="assignment-options">
          ${assignment.options.map((option, index) => `
            <div class="assignment-option" onclick="selectAssignment(${index})">
              <h3>${option.title}</h3>
              <p>${option.prompt}</p>
              <p><strong>Deliverable:</strong> ${option.deliverable}</p>
            </div>
          `).join('')}
        </div>

        <div class="peer-review-section">
          <h3>Peer Review Guidelines</h3>
          <p>${assignment.peerReview.instructions}</p>
          <ul class="criteria-list">
            ${assignment.peerReview.criteria.map(criterion => `<li>${criterion}</li>`).join('')}
          </ul>
          <p><strong>Review Format:</strong> ${assignment.peerReview.format}</p>
        </div>
      </div>
    `;

    // Render navigation buttons
    const navButtons = document.querySelector('#assignment-page .nav-buttons');
    if (navButtons) {
      navButtons.innerHTML = `
        <a href="?week=${this.week}&page=quiz" class="btn">← Back to Quiz</a>
        <a href="?week=${this.week}&page=conclusion" class="btn btn-primary">Next: Conclusions →</a>
      `;
    }
  }
  renderConclusion() {
    const { title, conclusion } = this.data;

    document.getElementById('page-title').textContent = `${title} - Conclusions`;

    const container = document.getElementById('conclusion-container');
    container.innerHTML = `
      <div class="intro-section">
        <h2>Congratulations on Completing Week ${this.week}!</h2>
        <p>${conclusion.message}</p>
      </div>

      <div class="lecture-section">
        <h3>Key Takeaways</h3>
        <ul class="objectives">
          ${conclusion.takeaways.map(takeaway => `<li>${takeaway}</li>`).join('')}
        </ul>
      </div>

      <div class="lecture-section">
        <h3>Ideas for Further Practice</h3>
        <ul class="objectives">
          ${conclusion.furtherPractice.map(practice => `<li>${practice}</li>`).join('')}
        </ul>
      </div>
    `;

    // Update nav buttons with Next Week button
    const navButtons = document.querySelector('#conclusion-page .nav-buttons');
    if (navButtons) {
      const nextWeek = parseInt(this.week) + 1;
      navButtons.innerHTML = `
        <a href="?week=${this.week}&page=intro" class="btn">← Back to Introduction</a>
        <a href="../index.html" class="btn btn-primary">Back to Home</a>
      `;
    }
  }

  async init() {
    await this.loadData();
    if (!this.data) {
      document.body.innerHTML = '<div class="container"><h1>Error loading content</h1></div>';
      return;
    }

    this.renderBreadcrumbs();

    switch(this.page) {
      case 'intro':
        this.renderIntroPage();
        break;
      case 'give-it-a-try':
        this.renderGiveItATry();
        break;
      case 'exercises':
        this.renderExercises();
        break;
      case 'quiz':
        this.renderQuiz();
        break;
      case 'assignment':
        this.renderAssignment();
        break;
      case 'conclusion':
        this.renderConclusion();
        break;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const loader = new ContentLoader();
  loader.init();
});