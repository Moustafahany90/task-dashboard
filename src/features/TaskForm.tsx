import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types/task.types';
import { Plus, X } from 'lucide-react';

const TaskForm = () => {
  // كل input ليها state خاص بيها - ده اسمه "Controlled Input"
  // يعني React هي اللي متحكمة في القيمة، مش الـ browser
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [isOpen, setIsOpen] = useState(false); // عشان نفتح ونقفل الفورم

  // نجيب الـ addTask function من الـ Context
  const { addTask } = useTasks();

  const handleSubmit = (e: React.FormEvent) => {
    // e.preventDefault() بتمنع الصفحة من إنها تعمل reload
    // لأن الـ browser بيعمل reload تلقائيًا لما تبعت form
    e.preventDefault();

    // لو العنوان فاضي، منعملش حاجة
    if (!title.trim()) return;

    // نعمل task جديدة بكل البيانات
    const newTask: Task = {
      id: crypto.randomUUID(), // الـ browser بيولد ID فريد تلقائيًا
      title: title.trim(),
      description: description.trim(),
      status: 'todo', // كل task جديدة بتبدأ في "To Do"
      priority,
      createdAt: new Date().toISOString(), // التاريخ والوقت الحالي
    };

    addTask(newTask); // نضيفها للـ Context

    // نفضي الفورم بعد الإضافة
    setTitle('');
    setDescription('');
    setPriority('medium');
    setIsOpen(false);
  };

  return (
    <div className="task-form-container">
      {/* زرار فتح الفورم */}
      {!isOpen ? (
        <button className="add-task-btn" onClick={() => setIsOpen(true)}>
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      ) : (
        /* الفورم نفسها */
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-header">
            <h3>Create New Task</h3>
            <button
              type="button"
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              placeholder="What needs to be done?"
              value={title}       // القيمة مرتبطة بالـ state
              onChange={e => setTitle(e.target.value)} // كل keystroke بتحدث الـ state
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              placeholder="Add some details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={e => setPriority(e.target.value as Task['priority'])}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            <Plus size={18} />
            Add Task
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
