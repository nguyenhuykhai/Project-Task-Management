import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase"; // Your firebase init
import type { Task, Sprint, TaskStore } from "../types";
import { INITIAL_TASKS, INITIAL_SPRINTS } from "../constants";
import { onAuthStateChanged } from "firebase/auth";

// Helper to get user-specific collection
const getUserCollection = (collectionName: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");
  return collection(db, `users/${userId}/${collectionName}`);
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: INITIAL_TASKS,
  sprints: INITIAL_SPRINTS,
  filterValue: "current_sprint",

  addTask: async (task: Omit<Task, "id">) => {
    const newTask = { ...task }; // Omit id, Firestore generates it
    await addDoc(getUserCollection("tasks"), newTask);
    // State updates via snapshot listener
  },

  updateTask: async (task) => {
    const taskRef = doc(getUserCollection("tasks"), task.id);
    await updateDoc(taskRef, { ...task });
  },

  deleteTask: async (id) => {
    const taskRef = doc(getUserCollection("tasks"), id);
    await deleteDoc(taskRef);
  },

  addSprint: async (sprint) => {
    const newSprint = { ...sprint };
    const docRef = await addDoc(getUserCollection("sprints"), newSprint);
    return { id: docRef.id, ...newSprint }; // Return with ID
  },

  updateSprint: async (sprint) => {
    const sprintRef = doc(getUserCollection("sprints"), sprint.id);
    await updateDoc(sprintRef, { ...sprint });
  },

  deleteSprint: async (id) => {
    const sprintRef = doc(getUserCollection("sprints"), id);
    await deleteDoc(sprintRef);
    // Also delete related tasks (optional: adjust as needed)
    const tasksQuery = query(
      getUserCollection("tasks"),
      where("sprintId", "==", id)
    );
    onSnapshot(tasksQuery, async (snapshot) => {
      for (const docSnap of snapshot.docs) {
        await deleteDoc(docSnap.ref);
      }
    });
  },

  setFilterValue: (filter) => {
    set({ filterValue: filter });
  },

  importData: async (data) => {
    // Clear existing
    const tasksQuery = query(getUserCollection("tasks"));
    onSnapshot(tasksQuery, async (snapshot) => {
      for (const docSnap of snapshot.docs) await deleteDoc(docSnap.ref);
    });
    const sprintsQuery = query(getUserCollection("sprints"));
    onSnapshot(sprintsQuery, async (snapshot) => {
      for (const docSnap of snapshot.docs) await deleteDoc(docSnap.ref);
    });

    // Import new
    for (const sprint of data.sprints) {
      await addDoc(getUserCollection("sprints"), sprint);
    }
    for (const task of data.tasks) {
      await addDoc(getUserCollection("tasks"), task);
    }
  },
}));

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Listen to tasks
    const tasksCol = collection(db, `users/${user.uid}/tasks`);
    onSnapshot(tasksCol, (snap) => {
      const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
      useTaskStore.setState({ tasks });
    });

    // Listen to sprints
    const sprintsCol = collection(db, `users/${user.uid}/sprints`);
    onSnapshot(sprintsCol, (snap) => {
      const sprints = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() } as Sprint)
      );
      useTaskStore.setState({ sprints });
    });
  } else {
    useTaskStore.setState({ tasks: [], sprints: [] });
  }
});
