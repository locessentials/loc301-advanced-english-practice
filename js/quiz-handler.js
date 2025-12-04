// Interactive handlers for activities, exercises, and quiz

// Give It a Try - Answer checking
function checkAnswer(index) {
  const activity = window.activitiesData[index];
  const userAnswer = document.getElementById(`answer-${index}`).value.trim();
  const feedbackDiv = document.getElementById(`feedback-${index}`);
  
  if (!userAnswer) {
    feedbackDiv.className = 'answer-feedback show';
    feedbackDiv.innerHTML = 'Please provide an answer first.';
    return;
  }

  // Simple check - in real implementation, you might want fuzzy matching
  const isCorrect = userAnswer.toLowerCase().includes(activity.answer.toLowerCase());
  
  feedbackDiv.className = `answer-feedback ${isCorrect ? 'correct' : 'show'}`;
  feedbackDiv.innerHTML = isCorrect 
    ? `✓ Great work! ${activity.explanation || ''}`
    : `The expected answer includes: "${activity.answer}". ${activity.explanation || ''}`;
}

// Exercises - Option selection
function selectOption(exerciseIndex, optionIndex, correctAnswer) {
  const exercise = window.exercisesData[exerciseIndex];
  const optionsList = document.querySelector(`[data-exercise="${exerciseIndex}"]`);
  const selectedOption = exercise.options[optionIndex];
  const isCorrect = selectedOption === correctAnswer;
  
  // Clear previous selections
  optionsList.querySelectorAll('li').forEach(li => {
    li.classList.remove('selected', 'correct', 'incorrect');
  });
  
  // Mark selected option
  const clickedLi = optionsList.querySelector(`[data-option="${optionIndex}"]`);
  clickedLi.classList.add('selected', isCorrect ? 'correct' : 'incorrect');
  
  // Show explanation
  const explanationDiv = document.getElementById(`explanation-${exerciseIndex}`);
  explanationDiv.className = 'explanation show';
  explanationDiv.innerHTML = isCorrect 
    ? `✓ Correct! ${exercise.explanation}`
    : `✗ ${exercise.explanation}`;
}

// Quiz - Option selection (stores answer, doesn't reveal correctness yet)
function selectQuizOption(questionIndex, optionIndex) {
  const optionsList = document.querySelector(`[data-quiz="${questionIndex}"]`);
  
  // Clear previous selection
  optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
  
  // Mark new selection
  const clickedLi = optionsList.querySelector(`[data-option="${optionIndex}"]`);
  clickedLi.classList.add('selected');
  
  // Store answer
  const question = window.quizQuestions[questionIndex];
  window.quizAnswers[questionIndex] = question.options[optionIndex];
}

// Quiz - Submit and check all answers
function submitQuiz() {
  const questions = window.quizQuestions;
  const answers = window.quizAnswers;
  
  // Check if all questions answered
  if (Object.keys(answers).length < 3) {
    alert('Please answer all questions before submitting.');
    return;
  }
  
  // Get week number from URL
  const params = new URLSearchParams(window.location.search);
  const week = params.get('week') || '1';
  
  // Check correctness and mark each question
  let correctCount = 0;
  questions.forEach((question, index) => {
    const isCorrect = answers[index] === question.correct;
    if (isCorrect) {
      correctCount++;
    }
    
    // Mark the selected option as correct or incorrect
    const optionsList = document.querySelector(`[data-quiz="${index}"]`);
    const selectedLi = optionsList.querySelector('.selected');
    
    if (selectedLi) {
      selectedLi.classList.remove('selected');
      selectedLi.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    
    // Also highlight the correct answer if user got it wrong
    if (!isCorrect) {
      const correctOptionIndex = question.options.indexOf(question.correct);
      const correctLi = optionsList.querySelector(`[data-option="${correctOptionIndex}"]`);
      if (correctLi) {
        correctLi.classList.add('correct');
      }
    }
    
    // Show explanation if available
    if (question.explanation) {
      const questionDiv = optionsList.closest('.quiz-question');
      const explanationDiv = document.createElement('div');
      explanationDiv.className = `explanation show ${isCorrect ? 'correct-explanation' : 'incorrect-explanation'}`;
      explanationDiv.innerHTML = isCorrect 
        ? `✓ Correct! ${question.explanation}`
        : `✗ ${question.explanation}`;
      questionDiv.appendChild(explanationDiv);
    }
  });
  
  const resultDiv = document.getElementById('quiz-result');
  const allCorrect = correctCount === 3;
  
  if (allCorrect) {
    resultDiv.className = 'quiz-result success show';
    resultDiv.innerHTML = `
      <h2>🎉 Excellent Work!</h2>
      <p>You got 3 questions correct in a row on the Week ${week} Quiz!</p>
      <p>You've demonstrated strong understanding of this week's concepts.</p>
    `;
    
    // Trigger confetti
    createConfetti();
  } else {
    resultDiv.className = 'quiz-result retry show';
    resultDiv.innerHTML = `
      <h2>Not quite there yet</h2>
      <p>You got ${correctCount} out of 3 correct.</p>
      <p>Review the incorrect questions above and try again. Each attempt helps strengthen your understanding!</p>
      <button class="btn btn-again" onclick="location.reload()">Try Again</button>
    `;
  }
  
  // Disable submit button and all quiz options
  event.target.disabled = true;
  event.target.style.opacity = '0.5';
  
  // Disable clicking on options after submission
  document.querySelectorAll('[data-quiz]').forEach(list => {
    list.style.pointerEvents = 'none';
  });
}

// Assignment - Option selection (visual feedback only)
function selectAssignment(index) {
  document.querySelectorAll('.assignment-option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  document.querySelectorAll('.assignment-option')[index].classList.add('selected');
}

// Confetti animation
function createConfetti() {
  const colors = ['#d4af37', '#2d5f3f', '#1a472a', '#ffd700'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + 's';
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
    
    document.body.appendChild(confetti);
    
    // Remove after animation
    setTimeout(() => confetti.remove(), 3000);
  }
}