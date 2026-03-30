<template>
    <div v-show="showHelp" class="w-80 lg:w-[30%] h-96 flex flex-col items-center justify-start bg-dark border-2 border-light shadow-xl shadow-dark p-2 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl">
        <span class="font-PoppinsBold text-xl">Need Help ? </span>
        <div class="w-4 h-4 bg-red absolute top-1 right-1 flex items-center justify-center rounded-full text-dark font-PoppinsBold p-3 cursor-pointer" @click="setShowHelp(false)">x</div>
        <div class="w-full h-1 bg-gray"></div>
        <div class="flex flex-col gap-2 w-full overflow-auto p-2">
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-red">Offline mode:</span> Enable to manage tasks locally without internet connection.
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-green">Online mode:</span> Enable to sync locally saved tasks to cloud and manage them realtime. 
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-green">Add task:</span> Write tasks in the input field.
                Then press [Enter] or click the add button to save. Added task will show under the todo section.
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-green">Mark as completed:</span> Click on the red circle on a task to mark it as completed.
                Completed tasks will move to completed section.
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-red">Mark as not completed:</span> Click on the green tick on a task to mark it as completed.
                Non completed tasks will be moved back to todo section.
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-green">Edit task:</span> Click on the task or click on the edit button.
                Then you can rewrite your task. Click on the update button to save.
            </span>
            <span class="w-full break-words text-start p-2 bg-gray rounded-xl">
                <span class="font-PoppinsBold text-red">Delete task:</span> Click on the trash icon on a task to delete it.
            </span>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState({
            showHelp: state => state.showHelp,
        })
    },
    methods:{
        ...mapActions(['setShowHelp'])
    },
}
</script>