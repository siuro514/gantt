import { create } from 'zustand';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import { Sprint, Member, Task, GanttState } from '@/types/gantt.types';
import { DEFAULT_SPRINT_COLOR } from '@/utils/colors';
import { detectOverlap } from '@/utils/overlapDetection';
import { getCurrentDateISO } from '@/utils/dateUtils';

interface GanttStore extends GanttState {
  // Sprint actions
  addSprint: (afterOrder?: number) => void;
  updateSprint: (id: string, updates: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  
  // Member actions
  addMember: (afterOrder?: number) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  reorderMembers: (fromIndex: number, toIndex: number) => void;
  
  // Task actions
  addTask: () => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (
    taskId: string,
    memberId: string | null,
    sprintId: string | null,
    position?: number,
    width?: number
  ) => void;
  reorderStorageTasks: (fromIndex: number, toIndex: number) => void;
  
  // Project
  updateProjectTitle: (title: string) => void;
  updatePrimaryColor: (color: string) => void;
  
  // Data management
  loadData: (data: GanttState) => void;
  exportData: () => GanttState;
  
  // Undo/Redo (provided by temporal)
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const initialState: GanttState = {
  sprints: [
    {
      id: nanoid(),
      title: 'Sprint 1',
      startDate: getCurrentDateISO(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: DEFAULT_SPRINT_COLOR,
      order: 0,
    },
    {
      id: nanoid(),
      title: 'Sprint 2',
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      color: '#D9B5B0',
      order: 1,
    },
  ],
  members: [
    {
      id: nanoid(),
      name: 'Member 1',
      order: 0,
    },
  ],
  tasks: [],
  projectTitle: 'Gantt Chart - 團隊任務管理',
  primaryColor: '#6750A4',
};

export const useGanttStore = create<GanttStore>()(
  temporal(
    (set, get) => ({
      ...initialState,

      // Sprint actions
      addSprint: (afterOrder) => {
        set((state) => {
          let newOrder: number;
          
          if (afterOrder === undefined) {
            // 沒有指定位置，添加到最後
            newOrder = Math.max(...state.sprints.map((s) => s.order), -1) + 1;
          } else {
            // 在指定位置之後插入，需要調整後面所有 sprint 的 order
            newOrder = afterOrder + 1;
          }
          
          const newSprint: Sprint = {
            id: nanoid(),
            title: `Sprint ${state.sprints.length + 1}`,
            startDate: getCurrentDateISO(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            color: DEFAULT_SPRINT_COLOR,
            order: newOrder,
          };
          
          // 如果是插入到中間，需要調整後面所有 sprint 的 order
          const updatedSprints = afterOrder !== undefined
            ? state.sprints.map(s => 
                s.order >= newOrder ? { ...s, order: s.order + 1 } : s
              )
            : state.sprints;
          
          return { sprints: [...updatedSprints, newSprint] };
        });
      },

      updateSprint: (id, updates) => {
        set((state) => ({
          sprints: state.sprints.map((sprint) =>
            sprint.id === id ? { ...sprint, ...updates } : sprint
          ),
        }));
      },

      deleteSprint: (id) => {
        set((state) => ({
          sprints: state.sprints.filter((sprint) => sprint.id !== id),
          // Sprint 刪除不影響 Task，因為 Task 不再綁定 Sprint
        }));
      },

      // Member actions
      addMember: (afterOrder) => {
        set((state) => {
          let newOrder: number;
          
          if (afterOrder === undefined) {
            // 沒有指定位置，添加到最後
            newOrder = Math.max(...state.members.map((m) => m.order), -1) + 1;
          } else {
            // 在指定位置之後插入，需要調整後面所有 member 的 order
            newOrder = afterOrder + 1;
          }
          
          const newMember: Member = {
            id: nanoid(),
            name: `Member ${state.members.length + 1}`,
            order: newOrder,
          };
          
          // 如果是插入到中間，需要調整後面所有 member 的 order
          const updatedMembers = afterOrder !== undefined
            ? state.members.map(m => 
                m.order >= newOrder ? { ...m, order: m.order + 1 } : m
              )
            : state.members;
          
          return { members: [...updatedMembers, newMember] };
        });
      },

      updateMember: (id, updates) => {
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id ? { ...member, ...updates } : member
          ),
        }));
      },

      deleteMember: (id) => {
        set((state) => ({
          members: state.members.filter((member) => member.id !== id),
          tasks: state.tasks.map((task) =>
            task.memberId === id
              ? { ...task, memberId: null, startX: 0, storageOrder: state.tasks.filter(t => t.memberId === null).length }
              : task
          ),
        }));
      },

      reorderMembers: (fromIndex, toIndex) => {
        set((state) => {
          const sortedMembers = [...state.members].sort((a, b) => a.order - b.order);
          const [removed] = sortedMembers.splice(fromIndex, 1);
          sortedMembers.splice(toIndex, 0, removed);
          
          return {
            members: sortedMembers.map((member, index) => ({
              ...member,
              order: index,
            })),
          };
        });
      },

      // Task actions
      addTask: () => {
        set((state) => {
          const storageTaskCount = state.tasks.filter((t) => t.memberId === null).length;
          const newTask: Task = {
            id: nanoid(),
            title: `Task ${state.tasks.length + 1}`,
            memberId: null,
            startX: 0,
            width: 171.5, // 默認寬度 = Sprint 寬度 (187.5) - 16
            rowIndex: 0,
            storageOrder: storageTaskCount,
          };
          return { tasks: [...state.tasks, newTask] };
        });
      },

      updateTask: (id, updates) => {
        set((state) => {
          const originalTask = state.tasks.find((t) => t.id === id);
          if (!originalTask) return state;

          let updatedTasks = state.tasks.map((task) => {
            if (task.id === id) {
              const updatedTask = { ...task, ...updates };
              
              // 如果有更新 startX、width 或 memberId，重新計算 rowIndex
              if ('startX' in updates || 'width' in updates || 'memberId' in updates) {
                if (updatedTask.memberId) {
                  const overlapResult = detectOverlap(
                    state.tasks,
                    updatedTask.memberId,
                    updatedTask.startX,
                    updatedTask.width,
                    id
                  );
                  updatedTask.rowIndex = overlapResult.suggestedRowIndex;
                }
              }
              
              return updatedTask;
            }
            return task;
          });

          // 如果有更新 startX 或 width，需要重新優化同一個 member 的所有其他卡片
          if (('startX' in updates || 'width' in updates) && originalTask.memberId) {
            updatedTasks = updatedTasks.map((t) => {
              if (t.memberId === originalTask.memberId && t.id !== id) {
                const overlapResult = detectOverlap(
                  updatedTasks,
                  originalTask.memberId,
                  t.startX,
                  t.width,
                  t.id
                );
                return { ...t, rowIndex: overlapResult.suggestedRowIndex };
              }
              return t;
            });
          }
          
          return { tasks: updatedTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const deletedMemberId = task.memberId;
          let updatedTasks = state.tasks.filter((task) => task.id !== id);

          // 如果刪除的是甘特圖中的卡片，需要重新優化該 member 的 rowIndex
          if (deletedMemberId) {
            updatedTasks = updatedTasks.map((t) => {
              if (t.memberId === deletedMemberId) {
                const overlapResult = detectOverlap(
                  updatedTasks,
                  deletedMemberId,
                  t.startX,
                  t.width,
                  t.id
                );
                return { ...t, rowIndex: overlapResult.suggestedRowIndex };
              }
              return t;
            });
          }

          return { tasks: updatedTasks };
        });
      },

      moveTask: (taskId, memberId, startX, width) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const oldMemberId = task.memberId; // 記錄原來的 memberId

          // 移到暫存區
          if (memberId === null) {
            const storageTaskCount = state.tasks.filter(
              (t) => t.memberId === null && t.id !== taskId
            ).length;
            
            let updatedTasks = state.tasks.map((t) =>
              t.id === taskId
                ? {
                    ...t,
                    memberId: null,
                    startX: 0,
                    width: t.width, // 保持原有寬度
                    storageOrder: storageTaskCount,
                    rowIndex: 0,
                  }
                : t
            );

            // 如果從甘特圖移到暫存區，需要優化原 member 的 rowIndex
            if (oldMemberId) {
              updatedTasks = updatedTasks.map((t) => {
                if (t.memberId === oldMemberId && t.id !== taskId) {
                  const overlapResult = detectOverlap(
                    updatedTasks,
                    oldMemberId,
                    t.startX,
                    t.width,
                    t.id
                  );
                  return { ...t, rowIndex: overlapResult.suggestedRowIndex };
                }
                return t;
              });
            }

            return { tasks: updatedTasks };
          }

          // 移到甘特圖
          const finalWidth = width !== undefined ? width : task.width; // 優先使用傳入的 width，否則保持原有
          const overlapResult = detectOverlap(
            state.tasks,
            memberId,
            startX,
            finalWidth,
            taskId
          );

          let updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  memberId,
                  startX,
                  width: finalWidth,
                  rowIndex: overlapResult.suggestedRowIndex,
                  storageOrder: undefined,
                }
              : t
          );

          // 如果從一個 member 移到另一個 member，需要優化原 member 的 rowIndex
          if (oldMemberId && oldMemberId !== memberId) {
            updatedTasks = updatedTasks.map((t) => {
              if (t.memberId === oldMemberId && t.id !== taskId) {
                const overlapResult = detectOverlap(
                  updatedTasks,
                  oldMemberId,
                  t.startX,
                  t.width,
                  t.id
                );
                return { ...t, rowIndex: overlapResult.suggestedRowIndex };
              }
              return t;
            });
          }

          return { tasks: updatedTasks };
        });
      },

      reorderStorageTasks: (fromIndex, toIndex) => {
        set((state) => {
          const storageTasks = state.tasks
            .filter((t) => t.memberId === null)
            .sort((a, b) => (a.storageOrder ?? 0) - (b.storageOrder ?? 0));
          
          const [removed] = storageTasks.splice(fromIndex, 1);
          storageTasks.splice(toIndex, 0, removed);
          
          const updatedStorageTasks = storageTasks.map((task, index) => ({
            ...task,
            storageOrder: index,
          }));
          
          const otherTasks = state.tasks.filter((t) => t.memberId !== null);
          
          return { tasks: [...otherTasks, ...updatedStorageTasks] };
        });
      },

      // Project
      updateProjectTitle: (title) => {
        set({ projectTitle: title });
      },

      updatePrimaryColor: (color) => {
        set({ primaryColor: color });
      },

      // Data management
      loadData: (data) => {
        set(data);
      },

      exportData: () => {
        const state = get();
        return {
          sprints: state.sprints,
          members: state.members,
          tasks: state.tasks,
          projectTitle: state.projectTitle,
          primaryColor: state.primaryColor,
        };
      },

      // Undo/Redo - 這些方法只是佔位符，實際使用 temporal API
      undo: () => {
        // 實際上會使用 useGanttStore.temporal.getState().undo()
      },

      redo: () => {
        // 實際上會使用 useGanttStore.temporal.getState().redo()
      },

      canUndo: () => {
        // 實際上會使用 useGanttStore.temporal.getState().pastStates.length > 0
        return false;
      },

      canRedo: () => {
        // 實際上會使用 useGanttStore.temporal.getState().futureStates.length > 0
        return false;
      },
    }),
    {
      limit: 50,
      partialize: (state) => ({
        sprints: state.sprints,
        members: state.members,
        tasks: state.tasks,
        projectTitle: state.projectTitle,
        primaryColor: state.primaryColor,
      }),
    }
  )
);

