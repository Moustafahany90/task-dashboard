import './App.css'
import TaskForm from './features/TaskForm'
import TaskList from './features/TaskList'
import { LayoutDashboard } from 'lucide-react'

function App() {
  // ملاحظة: الـ TaskProvider موجود في main.tsx
  // فكل الـ Components هنا يقدروا يستخدموا useTasks()
  return (
    <div className="dashboard">
      {/* Header بتاع الداشبورد */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <LayoutDashboard size={28} />
            <h1>Task Dashboard</h1>
          </div>
          <p className="header-subtitle">Organize your work, boost your productivity</p>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="dashboard-main">
        <TaskForm />
        <TaskList />
      </main>
    </div>
  )
}

export default App
