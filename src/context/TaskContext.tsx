import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Task } from '../types/task.types';

// تعريف شكل البيانات اللي الـ Context هيوفرها
// كل function هنا هتكون متاحة لأي Component جوه الـ Provider
interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void; // Partial يعني ممكن تبعت بعض الحقول مش كلها
  deleteTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// المفتاح اللي هنخزن بيه في الـ localStorage
const STORAGE_KEY = 'task-dashboard-tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initializer — الـ function دي بتشتغل مرة واحدة بس لما الـ component يتحمل
  // بتقرأ من localStorage ولو مفيش حاجة بترجع مصفوفة فاضية
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return []; // لو حصل error (مثلاً JSON مكسور) نرجع مصفوفة فاضية
    }
  });

  // كل ما التاسكات تتغير، نحفظها في localStorage
  // useEffect بيشتغل بعد كل render لما الـ [tasks] تتغير
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // إضافة تاسك جديدة - بنستخدم prev عشان نضمن إن القيمة دايمًا محدثة
  const addTask = (task: Task) => setTasks(prev => [...prev, task]);

  // تعديل تاسك موجودة - بنلف على كل التاسكات ونعدل اللي الـ id بتاعها مطابق
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // حذف تاسك - بنفلتر المصفوفة ونشيل اللي الـ id بتاعها مطابق
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Hook مخصص عشان تسحب البيانات بسهولة في أي Component
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};