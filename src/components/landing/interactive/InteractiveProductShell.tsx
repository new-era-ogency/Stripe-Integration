"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  Bell,
  FolderKanban,
  Kanban,
  MessageSquare,
  Plus,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AiMeetingDemo from "@/components/landing/interactive/AiMeetingDemo"
import PulseFlowLogo from "@/components/brand/PulseFlowLogo"
import {
  DEMO_TAB_EVENT,
  type DemoTab,
} from "@/lib/demo-navigation"
import {
  chatSeedMessages,
  chatSuggestions,
  initialProjects,
  initialTasks,
  kanbanColumns,
  type DemoProject,
  type DemoTask,
  type KanbanColumnId,
} from "@/lib/interactive-demo-data"

type ShellTab = DemoTab

type DemoToast = {
  id: string
  message: string
}

const PRESENCE = [
  { initials: "RK", color: "bg-violet-500" },
  { initials: "AK", color: "bg-cyan-500" },
  { initials: "PK", color: "bg-emerald-500" },
]

const TOAST_MESSAGES = [
  "Alex moved “LinkedIn authority post” to Review",
  "Priya commented on Steroid Olympics launch",
  "New task from AI Meeting added to In progress",
]

export default function InteractiveProductShell() {
  const [activeTab, setActiveTab] = useState<ShellTab>("kanban")
  const [tasks, setTasks] = useState<DemoTask[]>(initialTasks)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState(chatSeedMessages)
  const [typingReply, setTypingReply] = useState<string | null>(null)
  const [toasts, setToasts] = useState<DemoToast[]>([])
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const toastIndex = useRef(0)

  const selectedProject = useMemo(
    () => initialProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId]
  )

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  )

  const pushToast = useCallback((message: string) => {
    const id = `toast-${Date.now()}`
    setToasts((current) => [...current.slice(-2), { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 4200)
  }, [])

  useEffect(() => {
    const onTab = (event: Event) => {
      const tab = (event as CustomEvent<ShellTab>).detail
      if (tab) {
        setActiveTab(tab)
        setSelectedProjectId(null)
        setSelectedTaskId(null)
      }
    }
    window.addEventListener(DEMO_TAB_EVENT, onTab)
    return () => window.removeEventListener(DEMO_TAB_EVENT, onTab)
  }, [])

  useEffect(() => {
    const interval = window.setInterval(() => {
      pushToast(TOAST_MESSAGES[toastIndex.current % TOAST_MESSAGES.length])
      toastIndex.current += 1
    }, 9000)
    return () => window.clearInterval(interval)
  }, [pushToast])

  const addTask = (title: string, column: KanbanColumnId = "backlog") => {
    const trimmed = title.trim()
    if (!trimmed) return

    setTasks((current) => [
      ...current,
      {
        id: `t-${Date.now()}`,
        title: trimmed,
        column,
        projectId: selectedProjectId ?? "steroid-olympics",
        tag: "New",
      },
    ])
    setNewTaskTitle("")
    pushToast(`Task created: “${trimmed.slice(0, 40)}…”`)
  }

  const moveTask = (taskId: string, column: KanbanColumnId) => {
    const task = tasks.find((item) => item.id === taskId)
    setTasks((current) =>
      current.map((item) => (item.id === taskId ? { ...item, column } : item))
    )
    if (task && task.column !== column) {
      const columnLabel = kanbanColumns.find((col) => col.id === column)?.label
      pushToast(`Moved “${task.title.slice(0, 28)}…” to ${columnLabel}`)
    }
  }

  const handleChatSend = () => {
    const trimmed = chatInput.trim()
    if (!trimmed || typingReply) return

    setChatMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: "user", content: trimmed },
    ])
    setChatInput("")

    const fullReply =
      "Got it — I'd turn that into a 5-post X thread plus a LinkedIn carousel outline. Want me to add those as Kanban cards?"
    setTypingReply("")

    let index = 0
    const typeInterval = window.setInterval(() => {
      index += 1
      setTypingReply(fullReply.slice(0, index))
      if (index >= fullReply.length) {
        window.clearInterval(typeInterval)
        setChatMessages((current) => [
          ...current,
          { id: `a-${Date.now()}`, role: "assistant", content: fullReply },
        ])
        setTypingReply(null)
      }
    }, 18)
  }

  const handleMeetingTask = (decision: string) => {
    addTask(decision, "in_progress")
    setActiveTab("kanban")
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.9)]">
      <div className="relative flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <PulseFlowLogo size={28} />
          <div>
            <p className="text-xs font-semibold text-white">PulseFlow</p>
            <p className="text-[10px] text-zinc-500">Interactive preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center -space-x-2 sm:flex">
            {PRESENCE.map((person) => (
              <span
                key={person.initials}
                className={`presence-pulse flex size-6 items-center justify-center rounded-full border-2 border-zinc-900 text-[9px] font-bold text-white ${person.color}`}
                title="Teammate online"
              >
                {person.initials}
              </span>
            ))}
          </div>
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
            No signup · simulated
          </span>
        </div>

        <div className="pointer-events-none absolute right-4 top-full z-20 mt-2 flex w-72 flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="demo-toast-enter flex items-start gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900/95 px-3 py-2 text-[11px] text-zinc-300 shadow-lg"
            >
              <Bell className="mt-0.5 size-3 shrink-0 text-violet-400" />
              {toast.message}
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-[520px] flex-col lg:min-h-[560px] lg:flex-row">
        <aside className="flex gap-1 border-b border-zinc-800 bg-black/40 p-2 lg:w-44 lg:flex-col lg:border-b-0 lg:border-r">
          {(
            [
              { id: "kanban", label: "Kanban", icon: Kanban },
              { id: "projects", label: "Projects", icon: FolderKanban },
              { id: "chat", label: "AI Chat", icon: MessageSquare },
              { id: "meeting", label: "AI Meeting", icon: Video },
            ] as const
          ).map((item) => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedProjectId(null)
                  setSelectedTaskId(null)
                }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors lg:flex-none lg:justify-start ${
                  active
                    ? "bg-violet-500/15 text-violet-200"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                }`}
              >
                <Icon className="size-3.5 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </aside>

        <div className="min-h-0 flex-1 p-4 md:p-5">
          {activeTab === "kanban" ? (
            <KanbanView
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              newTaskTitle={newTaskTitle}
              draggedTaskId={draggedTaskId}
              onNewTaskTitleChange={setNewTaskTitle}
              onAddTask={() => addTask(newTaskTitle)}
              onSelectTask={setSelectedTaskId}
              onMoveTask={moveTask}
              onDragStart={setDraggedTaskId}
              onDragEnd={() => setDraggedTaskId(null)}
              selectedTask={selectedTask}
              onCloseTask={() => setSelectedTaskId(null)}
            />
          ) : null}

          {activeTab === "projects" ? (
            <ProjectsView
              projects={initialProjects}
              tasks={tasks}
              selectedProject={selectedProject}
              onOpenProject={setSelectedProjectId}
              onBack={() => setSelectedProjectId(null)}
              onOpenTask={(taskId) => {
                setSelectedTaskId(taskId)
                setActiveTab("kanban")
              }}
            />
          ) : null}

          {activeTab === "chat" ? (
            <ChatView
              messages={chatMessages}
              typingReply={typingReply}
              input={chatInput}
              onInputChange={setChatInput}
              onSend={handleChatSend}
              onSuggestion={(text) => setChatInput(text)}
            />
          ) : null}

          {activeTab === "meeting" ? (
            <AiMeetingDemo onKanbanTaskAdded={handleMeetingTask} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

function KanbanView({
  tasks,
  selectedTaskId,
  newTaskTitle,
  draggedTaskId,
  onNewTaskTitleChange,
  onAddTask,
  onSelectTask,
  onMoveTask,
  onDragStart,
  onDragEnd,
  selectedTask,
  onCloseTask,
}: {
  tasks: DemoTask[]
  selectedTaskId: string | null
  newTaskTitle: string
  draggedTaskId: string | null
  onNewTaskTitleChange: (value: string) => void
  onAddTask: () => void
  onSelectTask: (id: string) => void
  onMoveTask: (id: string, column: KanbanColumnId) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  selectedTask: DemoTask | null
  onCloseTask: () => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 gap-2">
          <Input
            value={newTaskTitle}
            onChange={(event) => onNewTaskTitleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onAddTask()
            }}
            placeholder="Create a task…"
            className="h-9 border-zinc-800 bg-black/50 text-sm text-zinc-200"
          />
          <Button
            type="button"
            onClick={onAddTask}
            className="h-9 shrink-0 bg-violet-600 px-3 hover:bg-violet-500"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {kanbanColumns.map((column) => (
          <div
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const taskId = event.dataTransfer.getData("text/task-id")
              if (taskId) onMoveTask(taskId, column.id)
              onDragEnd()
            }}
            className={`rounded-xl border p-2 transition-colors ${
              draggedTaskId
                ? "border-dashed border-violet-500/30 bg-violet-500/5"
                : "border-zinc-800/80 bg-zinc-900/30"
            }`}
          >
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {column.label}
            </p>
            <ul className="mt-2 space-y-2">
              {tasks
                .filter((task) => task.column === column.id)
                .map((task) => (
                  <li key={task.id}>
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.setData("text/task-id", task.id)
                        onDragStart(task.id)
                      }}
                      onDragEnd={onDragEnd}
                      onClick={() => onSelectTask(task.id)}
                      className={`w-full cursor-grab rounded-lg border px-3 py-2.5 text-left text-sm transition-all active:cursor-grabbing ${
                        selectedTaskId === task.id
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : draggedTaskId === task.id
                            ? "border-violet-400/40 bg-violet-500/5 opacity-60"
                            : "border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <span className="line-clamp-2">{task.title}</span>
                      {task.tag ? (
                        <span className="mt-1.5 inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                          {task.tag}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedTask ? (
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Task detail
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {selectedTask.title}
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseTask}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Close
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {kanbanColumns.map((column) => (
              <button
                key={column.id}
                type="button"
                onClick={() => onMoveTask(selectedTask.id, column.id)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] ${
                  selectedTask.column === column.id
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-200"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                Move to {column.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ProjectsView({
  projects,
  tasks,
  selectedProject,
  onOpenProject,
  onBack,
  onOpenTask,
}: {
  projects: DemoProject[]
  tasks: DemoTask[]
  selectedProject: DemoProject | null
  onOpenProject: (id: string) => void
  onBack: () => void
  onOpenTask: (taskId: string) => void
}) {
  if (selectedProject) {
    const projectTasks = tasks.filter(
      (task) => task.projectId === selectedProject.id
    )

    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"
        >
          <ArrowLeft className="size-3.5" />
          All projects
        </button>
        <div>
          <p className="text-lg font-semibold text-white">{selectedProject.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {selectedProject.description}
          </p>
        </div>
        <ul className="space-y-2">
          {projectTasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => onOpenTask(task.id)}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:border-zinc-600"
              >
                {task.title}
                <span className="text-[10px] uppercase text-zinc-600">
                  {task.column.replace("_", " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => onOpenProject(project.id)}
          className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-left transition-all hover:border-violet-500/30 hover:bg-violet-500/5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-white">{project.name}</p>
            <span className="rounded-md border border-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-500">
              {project.status}
            </span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            {project.description}
          </p>
          <p className="mt-3 text-[10px] font-medium text-violet-400/90">
            {project.tasksOpen} open tasks →
          </p>
        </button>
      ))}
    </div>
  )
}

function ChatView({
  messages,
  typingReply,
  input,
  onInputChange,
  onSend,
  onSuggestion,
}: {
  messages: typeof chatSeedMessages
  typingReply: string | null
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  onSuggestion: (text: string) => void
}) {
  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[90%] rounded-xl px-3 py-2.5 text-sm leading-relaxed ${
              message.role === "user"
                ? "ml-auto border border-violet-500/25 bg-violet-500/10 text-violet-100"
                : "border border-zinc-800 bg-zinc-950/80 text-zinc-300"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ))}
        {typingReply !== null ? (
          <div className="max-w-[90%] rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2.5 text-sm leading-relaxed text-zinc-300">
            <p className="whitespace-pre-wrap">
              {typingReply}
              <span className="ml-0.5 inline-block h-3.5 w-1 animate-pulse bg-violet-400" />
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {chatSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="rounded-full border border-zinc-800 px-2.5 py-1 text-[11px] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSend()
          }}
          placeholder="Ask PulseFlow AI…"
          className="h-9 border-zinc-800 bg-black/50 text-sm"
          disabled={typingReply !== null}
        />
        <Button
          type="button"
          onClick={onSend}
          disabled={typingReply !== null}
          className="h-9 bg-violet-600 px-4 hover:bg-violet-500"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
