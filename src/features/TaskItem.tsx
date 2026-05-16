import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types/task.types';
import { Trash2, Clock, ArrowRight, CheckCircle, Edit2, X, Save } from 'lucide-react';

// Props = البيانات اللي الـ parent component (TaskList) بيبعتها للـ TaskItem
interface TaskItemProps {
  task: Task;
}

// ألوان الـ Priority - كل أولوية ليها لون مختلف
const priorityConfig = {
  high: { label: 'High', className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low: { label: 'Low', className: 'priority-low' },
};

// خريطة الـ Status التالي - لما تضغط على السهم، التاسك تتنقل للمرحلة اللي بعدها
const nextStatus: Record<Task['status'], Task['status'] | null> = {
  'todo': 'in-progress',
  'in-progress': 'done',
  'done': null, // مفيش مرحلة بعد "Done"
};

const TaskItem = ({ task }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);

  // نجيب الـ functions من الـ Context
  const { updateTask, deleteTask } = useTasks();

  const handleSave = () => {
    if (!editTitle.trim()) return;
    updateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const priority = priorityConfig[task.priority];
  const next = nextStatus[task.status];

  // نحسب الوقت اللي فات من إنشاء التاسك
  const timeAgo = getTimeAgo(task.createdAt);

  return (
    <div className={`task-card ${task.priority}-border`}>
      {isEditing ? (
        <div className="edit-task-form">
          <input
            className="edit-input"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows={2}
          />
          <select
            className="edit-select"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value as Task['priority'])}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <div className="edit-actions">
            <button className="action-btn save-btn" onClick={handleSave} title="Save">
              <Save size={16} />
            </button>
            <button className="action-btn cancel-btn" onClick={handleCancel} title="Cancel">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header: العنوان + Badge الأولوية */}
          <div className="task-card-header">
            <h4 className="task-title">{task.title}</h4>
            <span className={`priority-badge ${priority.className}`}>
              {priority.label}
            </span>
          </div>

          {/* الوصف - بيظهر بس لو موجود */}
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Footer: الوقت + الأزرار */}
          <div className="task-card-footer">
        <span className="task-time">
          <Clock size={14} />
          {timeAgo}
        </span>

        <div className="task-actions">
          {/* زرار نقل التاسك للمرحلة التالية */}
          {next && (
            <button
              className="action-btn move-btn"
              onClick={() => updateTask(task.id, { status: next })}
              title={`Move to ${next}`}
            >
              {next === 'done' ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
            </button>
          )}

          {/* زرار التعديل */}
          <button
            className="action-btn edit-btn"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>

          {/* زرار الحذف */}
          <button
            className="action-btn delete-btn"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

// Helper function - بتحسب الوقت اللي فات (مثلاً "5 minutes ago")
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default TaskItem;
