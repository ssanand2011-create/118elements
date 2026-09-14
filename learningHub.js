/**
 * ELEMENT 118 — CHEMISTRY LEARNING HUB COMPONENT
 * Interactive educational dashboard covering 16 key chemistry topics with mini-quizzes and completion tracking.
 */

class LearningHubComponent {
  constructor() {
    this.container = null;
    this.selectedTopic = null;
  }

  init() {
    this.container = document.getElementById('learning-hub-container');
    if (!this.container || typeof LEARNING_TOPICS === 'undefined') return;

    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.selectedTopic) {
      this.renderTopicDetail(this.selectedTopic);
    } else {
      this.renderTopicGrid();
    }
  }

  renderTopicGrid() {
    const completedList = window.storageService ? window.storageService.state.learningCompletedTopics : [];
    const completedCount = completedList.length;

    this.container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          <div>
            <div class="badge badge-cyan" style="margin-bottom:0.5rem;">Comprehensive Chemistry Curriculum</div>
            <h1 style="font-size:2rem; margin:0;">Chemistry Learning Hub</h1>
            <p style="color:var(--text-secondary); font-size:0.95rem; margin-top:0.25rem;">
              Master fundamental chemistry principles through 16 interactive modules, formulas, and verification tests.
            </p>
          </div>
          <div class="glass-card" style="padding:0.75rem 1.25rem; display:flex; align-items:center; gap:1rem;">
            <div>
              <div style="font-size:0.7rem; color:var(--text-secondary); text-transform:uppercase; font-weight:700;">Progress</div>
              <div style="font-size:1.25rem; font-weight:800; font-family:var(--font-mono); color:var(--accent-cyan);">${completedCount} / 16 Completed</div>
            </div>
            <div style="width:60px; height:8px; background:var(--bg-tertiary); border-radius:var(--radius-full); overflow:hidden;">
              <div style="width:${(completedCount / 16) * 100}%; height:100%; background:var(--accent-cyan); border-radius:var(--radius-full);"></div>
            </div>
          </div>
        </div>

        <div class="learning-grid">
          ${LEARNING_TOPICS.map(topic => {
            const isDone = completedList.includes(topic.id);
            return `
              <div class="topic-card ${isDone ? 'completed' : ''}" onclick="window.learningHub.openTopic('${topic.id}')">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
                    <span style="font-size:2rem;">${topic.icon}</span>
                    <span class="badge ${isDone ? 'badge-emerald' : 'badge-cyan'}" style="font-size:0.65rem;">
                      ${isDone ? '✓ Completed' : 'Start Topic'}
                    </span>
                  </div>
                  <h3 style="font-size:1.15rem; margin-bottom:0.5rem;">${topic.title}</h3>
                  <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">${topic.summary.substring(0, 110)}...</p>
                </div>
                <div>
                  <div class="topic-progress-bar">
                    <div class="topic-progress-fill" style="width:${isDone ? '100%' : '0%'}; background:${isDone ? 'var(--accent-emerald)' : 'var(--accent-cyan)'};"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  openTopic(topicId) {
    const topic = LEARNING_TOPICS.find(t => t.id === topicId);
    if (!topic) return;

    if (window.audioService) window.audioService.playClick();
    this.selectedTopic = topic;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeTopic() {
    if (window.audioService) window.audioService.playClick();
    this.selectedTopic = null;
    this.render();
  }

  renderTopicDetail(topic) {
    const isDone = window.storageService && window.storageService.state.learningCompletedTopics.includes(topic.id);

    this.container.innerHTML = `
      <div style="max-width:860px; margin:0 auto;">
        <!-- Top Navigation -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="window.learningHub.closeTopic()">
            ← Back to Learning Modules
          </button>
          <span class="badge ${isDone ? 'badge-emerald' : 'badge-cyan'}">
            ${isDone ? '✓ Module Completed' : 'Module In Progress'}
          </span>
        </div>

        <!-- Topic Header Card -->
        <div class="glass-card" style="margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
            <div style="font-size:2.5rem;">${topic.icon}</div>
            <div>
              <h1 style="font-size:1.8rem; margin:0;">${topic.title}</h1>
              <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.2rem;">ELEMENT 118 Chemistry Foundation Series</div>
            </div>
          </div>
          <p style="color:var(--text-primary); font-size:1.05rem; line-height:1.7;">
            ${topic.summary}
          </p>
        </div>

        <!-- Core Scientific Principles -->
        <div class="glass-card" style="margin-bottom:1.5rem;">
          <h3 style="font-size:1.2rem; margin-bottom:1rem; color:var(--accent-cyan);">🔬 Core Scientific Principles</h3>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.75rem; font-size:0.95rem; line-height:1.6;">
            ${topic.keyPoints.map(pt => `<li>${pt}</li>`).join('')}
          </ul>

          <!-- Formula Callout -->
          <div style="margin-top:1.5rem; padding:1rem 1.25rem; background:var(--bg-tertiary); border-left:4px solid var(--accent-purple); border-radius:var(--radius-md);">
            <div style="font-size:0.75rem; font-weight:700; color:var(--accent-purple); text-transform:uppercase; margin-bottom:0.25rem;">Key Mathematical / Theoretical Relation:</div>
            <div style="font-family:var(--font-mono); font-size:0.95rem; color:var(--text-primary);">${topic.formula}</div>
          </div>
        </div>

        <!-- Verification Mini-Quiz Card -->
        <div class="glass-card" style="border-color:var(--border-bright);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.2rem; margin:0;">📝 Concept Verification Mini-Quiz</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">${topic.miniQuiz.length} Questions</span>
          </div>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.5rem;">
            Answer the verification questions correctly to complete this module and record progress in your Chemistry Score (PCS).
          </p>

          <div id="mini-quiz-questions-container" style="display:flex; flex-direction:column; gap:1.5rem;">
            ${topic.miniQuiz.map((q, qIdx) => `
              <div class="mini-quiz-block" data-qidx="${qIdx}" style="background:var(--bg-tertiary); padding:1.25rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div style="font-weight:700; font-size:1rem; margin-bottom:0.75rem;">
                  Q${qIdx + 1}. ${q.question}
                </div>
                <div class="quiz-options" style="gap:0.5rem;">
                  ${q.options.map((opt, optIdx) => `
                    <button class="quiz-option-btn mini-opt-btn" 
                            data-qidx="${qIdx}" 
                            data-optidx="${optIdx}" 
                            style="padding:0.65rem 1rem; font-size:0.9rem;">
                      <span class="mono" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">${['A', 'B', 'C', 'D'][optIdx]}.</span>
                      <span>${opt}</span>
                    </button>
                  `).join('')}
                </div>
                <div class="mini-quiz-feedback" id="feedback-${qIdx}" style="display:none; margin-top:0.75rem; padding:0.6rem 0.85rem; border-radius:var(--radius-sm); font-size:0.85rem;"></div>
              </div>
            `).join('')}
          </div>

          <div style="margin-top:1.5rem; display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" id="mini-quiz-check-btn">
              Verify Answers & Complete Module
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindMiniQuizEvents(topic);
  }

  bindMiniQuizEvents(topic) {
    const userAnswers = {};
    const optButtons = this.container.querySelectorAll('.mini-opt-btn');

    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = btn.getAttribute('data-qidx');
        const optIdx = parseInt(btn.getAttribute('data-optidx'), 10);

        if (window.audioService) window.audioService.playClick();
        userAnswers[qIdx] = optIdx;

        // Visual selection state
        this.container.querySelectorAll(`.mini-opt-btn[data-qidx="${qIdx}"]`).forEach(b => {
          b.classList.remove('selected');
        });
        btn.classList.add('selected');
      });
    });

    const checkBtn = document.getElementById('mini-quiz-check-btn');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        let allCorrect = true;
        let answeredCount = 0;

        topic.miniQuiz.forEach((q, idx) => {
          const userChoice = userAnswers[idx];
          const feedbackEl = document.getElementById(`feedback-${idx}`);
          if (feedbackEl) feedbackEl.style.display = 'block';

          if (userChoice === undefined) {
            allCorrect = false;
            if (feedbackEl) {
              feedbackEl.style.background = 'rgba(239, 68, 68, 0.15)';
              feedbackEl.style.color = '#f87171';
              feedbackEl.textContent = 'Please select an option for this question.';
            }
            return;
          }

          answeredCount++;
          const optBtns = this.container.querySelectorAll(`.mini-opt-btn[data-qidx="${idx}"]`);

          if (userChoice === q.correctIndex) {
            optBtns[userChoice].classList.add('correct');
            if (feedbackEl) {
              feedbackEl.style.background = 'rgba(16, 185, 129, 0.15)';
              feedbackEl.style.color = '#34d399';
              feedbackEl.innerHTML = `<strong>✓ Correct!</strong> ${q.explanation}`;
            }
          } else {
            allCorrect = false;
            optBtns[userChoice].classList.add('wrong');
            optBtns[q.correctIndex].classList.add('correct');
            if (feedbackEl) {
              feedbackEl.style.background = 'rgba(239, 68, 68, 0.15)';
              feedbackEl.style.color = '#f87171';
              feedbackEl.innerHTML = `<strong>✗ Incorrect.</strong> ${q.explanation}`;
            }
          }
        });

        if (allCorrect && answeredCount === topic.miniQuiz.length) {
          if (window.audioService) window.audioService.playCorrect();
          if (window.storageService) {
            window.storageService.markTopicCompleted(topic.id);
          }
          checkBtn.textContent = '🎉 Module Successfully Completed!';
          checkBtn.classList.remove('btn-primary');
          checkBtn.classList.add('btn-success');
          checkBtn.disabled = true;
        } else {
          if (window.audioService) window.audioService.playWrong();
        }
      });
    }
  }
}

window.learningHub = new LearningHubComponent();
