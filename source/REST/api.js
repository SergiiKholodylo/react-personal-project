import { MAIN_URL, TOKEN } from './config';

export const api = {

    error: (value) => {
        if (console) {
            console.error(value);
        }
    },

    updateTask: async (task) => {
        try {
            const response = await fetch(MAIN_URL, {
                method:  'PUT',
                headers: {
                    Authorization:  TOKEN,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            const { data: newTasks } = await response.json();

            return newTasks;
        } catch (err) {
            this.error(err);
        }
    },

    createTask: async (message) => {
        try {
            const response = await fetch(MAIN_URL, {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  TOKEN,
                },
                body: JSON.stringify({ message }),
            });

            const { data: task } = await response.json();

            return task;
        } catch (err) {
            this.error(err);
        }
    },

    fetchTasks: async () => {
        try {
            const response = await fetch(MAIN_URL, {
                method:  'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  TOKEN,
                },
            });

            const { data: tasks } = await response.json();

            return tasks;
        } catch (err) {
            this.error(err);
        }
    },

    removeTask: async (id) => {
        try {
            await fetch(`${MAIN_URL}/${id}`, {
                method:  'DELETE',
                headers: {
                    Authorization: TOKEN,
                },
            });
        } catch (err) {
            this.error(err);
        }
    },

    completeAllTasks: async (tasks) => {

        const ts = await Promise.all(tasks.map((task) => {
            task.completed = true;
            
            return api.updateTask([task]);
        }));

        //return ts.concat.apply([], ts);
    },

};
