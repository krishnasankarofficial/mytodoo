import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import db, { auth } from "./init";


// Firebase APIs.

export const syncTasksToFirestore = async ( localTasks, userId ) => {
    const tasksCollection = collection(db, 'tasks')
    for(let task of localTasks) {
        const querySnapshot = await getDocs(query(tasksCollection, where('task_id', '==', task.task_id), where('user_id', '==', userId)));
        task.created_at = new Date(task.created_at)
        task.updated_at = new Date(task.updated_at)
        task.user_id = userId
        if (querySnapshot.empty) {
            try {
                await addDoc(tasksCollection, task);
            } catch (error) {
                console.error('Error adding task:', task, error);
                return { status: false, error: error.message };
            }
        } else {
            querySnapshot.forEach(async (docSnapshot) => {
                try {
                    const docRef = doc(db, 'tasks', docSnapshot.id);
                    await updateDoc(docRef, task);
                } catch (error) {
                    console.error('Error updating task:', task, error);
                    return { status: false, error: error.message };
                }
            });

        }

    }
    return {status:true} 
}

export const loadTasksFromFirestore = async (userId) => {
    const tasksCollection = collection(db, 'tasks')
    const tasksSnapshot = await getDocs(query(tasksCollection, where('user_id', '==', userId), orderBy('task_id', 'desc')))
    return tasksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            created_at: data.created_at ? data.created_at.toDate() : null,
            updated_at: data.updated_at ? data.updated_at.toDate() : null
        };
    });

}

export const addTaskToFirestore = async (task) => {
    const tasksCollection = collection(db, 'tasks')
    const docRef = await addDoc(tasksCollection, task)
    return ({ id:docRef.id, ...task})
}

export const updateTaskInFirestore = async (id, task) => {
    const tasksCollection = collection(db, 'tasks')
    const tasksSnapshot = await getDocs(query(tasksCollection, where('task_id', '==', id)))
    if(!tasksSnapshot.empty){
        tasksSnapshot.forEach(async (docSnapshot) => {
            try {
                const docRef = doc(db, 'tasks', docSnapshot.id);
                await updateDoc(docRef, task);
            } catch (error) {
                console.error('Error updating task:', task, error);
                return { status: false, error: error.message };
            }
        });
    }
    return null
}

export const deleteTaskFromFirestore = async (id, userId) => {
    const tasksCollection = collection(db, 'tasks')
    const tasksSnapshot = await getDocs(query(tasksCollection, where('task_id', '==', id), where('user_id', '==', userId)))
    if(!tasksSnapshot.empty){
        tasksSnapshot.forEach(async (docSnapshot) => {
            try {
                const docRef = doc(db, 'tasks', docSnapshot.id);
                return await deleteDoc(docRef);
            } catch (error) {
                console.error('Error deleting task:', task, error);
                return { status: false, error: error.message };
            }
        });
    }
}

