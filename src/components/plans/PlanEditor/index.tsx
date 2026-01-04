"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  taskCode: string;
  taskName: string;
  goal: string;
  question: string;
  examples: string;
  performanceCriteria: string;
  score: number;
  notes?: string;
  order: number;
}

interface Stage {
  id: string;
  title: string;
  period: string;
  tasks: Task[];
}

interface PlanEditorProps {
  planId: string;
  initialStages: Stage[];
  onSave: (stages: Stage[]) => Promise<void>;
}

export function PlanEditor({ planId, initialStages, onSave }: PlanEditorProps) {
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragEnd = (event: DragEndEvent, stageId: string) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setStages((stages) =>
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;

        const oldIndex = stage.tasks.findIndex((t) => t.id === active.id);
        const newIndex = stage.tasks.findIndex((t) => t.id === over.id);

        const newTasks = [...stage.tasks];
        const [removed] = newTasks.splice(oldIndex, 1);
        newTasks.splice(newIndex, 0, removed);

        // Update order
        return {
          ...stage,
          tasks: newTasks.map((t, idx) => ({ ...t, order: idx + 1 })),
        };
      })
    );
  };

  const handleTaskUpdate = (stageId: string, taskId: string, updates: Partial<Task>) => {
    setStages((stages) =>
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          tasks: stage.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        };
      })
    );
  };

  const handleDeleteTask = (stageId: string, taskId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المهمة؟")) return;

    setStages((stages) =>
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          tasks: stage.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  };

  const handleDuplicateTask = (stageId: string, taskId: string) => {
    setStages((stages) =>
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;
        
        const taskIndex = stage.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return stage;

        const originalTask = stage.tasks[taskIndex];
        const newTask = {
          ...originalTask,
          id: `temp-${Date.now()}`,
          taskCode: `${originalTask.taskCode}-نسخة`,
        };

        const newTasks = [...stage.tasks];
        newTasks.splice(taskIndex + 1, 0, newTask);

        return {
          ...stage,
          tasks: newTasks.map((t, idx) => ({ ...t, order: idx + 1 })),
        };
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(stages);
      alert("تم حفظ التعديلات بنجاح!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("فشل في حفظ التعديلات");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">محرر الخطة العلاجية</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </div>

      {stages.map((stage, stageIdx) => (
        <Card key={stage.id} className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              المرحلة {stageIdx + 1}: {stage.title}
            </h3>
            <p className="text-sm text-gray-600">{stage.period}</p>
          </div>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, stage.id)}
          >
            <SortableContext
              items={stage.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {stage.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => handleDeleteTask(stage.id, task.id)}
                    onDuplicate={() => handleDuplicateTask(stage.id, task.id)}
                    onScoreChange={(score) =>
                      handleTaskUpdate(stage.id, task.id, { score })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </Card>
      ))}

      {/* Edit Task Dialog */}
      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => {
            const stageId = stages.find((s) =>
              s.tasks.some((t) => t.id === editingTask.id)
            )?.id;
            if (stageId) {
              handleTaskUpdate(stageId, editingTask.id, updates);
            }
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  onEdit,
  onDelete,
  onDuplicate,
  onScoreChange,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onScoreChange: (score: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{task.taskCode}</Badge>
          <span className="font-semibold text-gray-900">{task.taskName}</span>
        </div>
        <p className="text-sm text-gray-600">{task.goal.substring(0, 100)}...</p>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-sm">الدرجة:</Label>
        <select
          value={task.score}
          onChange={(e) => onScoreChange(parseInt(e.target.value))}
          className="px-2 py-1 border rounded"
        >
          <option value={0}>0</option>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </div>

      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={onEdit}>
          تعديل
        </Button>
        <Button size="sm" variant="outline" onClick={onDuplicate}>
          نسخ
        </Button>
        <Button size="sm" variant="outline" onClick={onDelete}>
          حذف
        </Button>
      </div>
    </div>
  );
}

// Task Edit Dialog
function TaskEditDialog({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
}) {
  const [formData, setFormData] = useState(task);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل المهمة: {task.taskCode}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>اسم المهمة</Label>
            <Input
              value={formData.taskName}
              onChange={(e) =>
                setFormData({ ...formData, taskName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>الهدف</Label>
            <Textarea
              value={formData.goal}
              onChange={(e) =>
                setFormData({ ...formData, goal: e.target.value })
              }
              rows={3}
            />
          </div>

          <div>
            <Label>السؤال التقييمي</Label>
            <Input
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            />
          </div>

          <div>
            <Label>أمثلة</Label>
            <Textarea
              value={formData.examples}
              onChange={(e) =>
                setFormData({ ...formData, examples: e.target.value })
              }
              rows={2}
            />
          </div>

          <div>
            <Label>محكات الأداء</Label>
            <Textarea
              value={formData.performanceCriteria}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  performanceCriteria: e.target.value,
                })
              }
              rows={3}
            />
          </div>

          <div>
            <Label>ملاحظات</Label>
            <Textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button onClick={() => onSave(formData)}>حفظ التعديلات</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

