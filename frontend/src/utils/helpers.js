export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const getDifficultyColor = (difficulty) => {
  const map = { Easy: 'success', Medium: 'warning', Hard: 'danger', Mixed: 'primary' };
  return map[difficulty] || 'secondary';
};

export const getCategoryIcon = (category) => {
  const map = {
    'Programming': '💻',
    'JavaScript': '🟨',
    'React': '⚛️',
    'Node.js': '🟢',
    'Database': '🗄️',
    'Aptitude': '🧮',
    'General Knowledge': '🌍'
  };
  return map[category] || '📚';
};

export const getScoreColor = (percentage) => {
  if (percentage >= 80) return 'var(--success)';
  if (percentage >= 60) return 'var(--warning)';
  if (percentage >= 40) return 'var(--primary)';
  return 'var(--danger)';
};

export const getGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

export const CATEGORIES = ['Programming', 'JavaScript', 'React', 'Node.js', 'Database', 'Aptitude', 'General Knowledge'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Mixed'];
