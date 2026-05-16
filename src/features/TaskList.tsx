import { useTasks } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { ClipboardList, Loader, CheckCheck } from 'lucide-react';

// تعريف بيانات كل عمود في الـ Kanban Board
const columns = [
  {
    status: 'todo' as const,      // as const بتقول لـ TypeScript إن القيمة ثابتة مش string عادي
    title: 'To Do',
    icon: ClipboardList,
    emptyText: 'No tasks yet. Create one!',
  },
  {
    status: 'in-progress' as const,
    title: 'In Progress',
    icon: Loader,
    emptyText: 'Move a task here to start working.',
  },
  {
    status: 'done' as const,
    title: 'Done',
    icon: CheckCheck,
    emptyText: 'Complete tasks to see them here.',
  },
];

const TaskList = () => {
  // نجيب كل التاسكات من الـ Context
  const { tasks } = useTasks();

  return (
    <div className="kanban-board">
      {/* بنلف على الأعمدة ونعرض كل عمود */}
      {columns.map(column => {
        // نفلتر التاسكات حسب الـ status بتاع العمود ده
        const columnTasks = tasks.filter(t => t.status === column.status);
        const Icon = column.icon; // لازم يبدأ بحرف كبير عشان React يعرف إنه Component

        return (
          <div key={column.status} className={`kanban-column column-${column.status}`}>
            {/* Header العمود */}
            <div className="column-header">
              <div className="column-title-group">
                <Icon size={18} />
                <h3>{column.title}</h3>
              </div>
              {/* Badge بعدد التاسكات */}
              <span className="column-count">{columnTasks.length}</span>
            </div>

            {/* قائمة التاسكات */}
            <div className="column-tasks">
              {columnTasks.length === 0 ? (
                // لو مفيش تاسكات، نعرض رسالة
                <p className="empty-column">{column.emptyText}</p>
              ) : (
                // لو فيه تاسكات، نعرض كل واحدة في TaskItem
                // key مهم جدًا - React بيستخدمه عشان يعرف أي عنصر اتغير
                columnTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
