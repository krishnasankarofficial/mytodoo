<script>
    import Header from './Header.vue'
    import Footer from './Footer.vue'
    import moment from 'moment'
    import Loading from './Loading.vue'
    import Help from './Help.vue'

    import { mapState, mapGetters, mapActions } from 'vuex'

    const INTRO_STORAGE_KEY = 'stride_intro_seen'

    export default {
        components: {
            Header,
            Footer,
            Loading,
            Help,
        },
        data() {
            return {
                taskInput:'',
                showPending: true,
                showCompleted: true,
                showWarning: false,
                currentDateTime: moment(new Date()).format('MMMM DD, YYYY, h:mm:ss a'),
            }
        },
        watch:{
            tasks: {
                handler(newTasks) {
                    this.saveTasksLocal(newTasks)
                    this.setLoading(false)
                },
                deep: true,
            },
            showWarning(isShowing){
                if(isShowing){
                    setTimeout(() => {
                        this.showWarning = false
                    }, 3000)
                }
            },
        },
        computed: {
            ...mapState({
                tasks: state => state.tasks,
                loading: state => state.loading,
                showHelp: state => state.showHelp,
            }),
            ...mapGetters([
                'tasksTotalCount',
                'tasksCompletedCount',
                'tasksPendingCount',
                'nextTaskId',
            ])
        },
        methods: {
            ...mapActions(['loadTasks', 'saveTasksLocal', 'addTask', 'updateTask', 'deleteTask', 'setLoading', 'setShowHelp', 'setNotification']),
            showFirstRunIntroIfNeeded() {
                try {
                    if (localStorage.getItem(INTRO_STORAGE_KEY)) return
                    localStorage.setItem(INTRO_STORAGE_KEY, '1')
                    this.setNotification({
                        message: 'Tasks are stored in this browser only. Clearing site data will remove them.',
                        type: 'normal',
                    })
                } catch {
                    /* private mode or storage blocked */
                }
            },
            updateDate(date){
                const givenDate = moment(date);
                const today = moment();
                const yesterday = moment().subtract(1, 'days');
                const isToday = givenDate.isSame(today, 'day');
                const isYesterday = givenDate.isSame(yesterday, 'day');
                if(isToday) return 'Today, ' + moment(date).format('hh:mm a')
                if(isYesterday) return 'Yesterday, ' + moment(date).format('hh:mm a')
                return moment(date).format('MMMM DD, YYYY, h:mm a')
            },
            updateCurrentDateTime(){
                this.currentDateTime = moment(new Date()).format('MMMM DD, YYYY, h:mm:ss a')
            },
            handleAddTask() {
                if (this.taskInput.trim() !== "") {
                    this.setLoading(true)
                    const newTask = {
                        'task_id': this.nextTaskId,
                        'task': this.taskInput.trim(),
                        'status': false,
                        'edit': false,
                        'created_at': new Date(),
                        'updated_at': new Date(),
                    }
                    this.addTask(newTask)
                    this.taskInput = ''
                    this.showWarning = false
                } else {
                    this.showWarning = true
                }
            },
            handleUpdateTask(index) {
                this.setLoading(true)
                this.tasks[index].edit = false
                const task = {
                    'id': this.tasks[index].id?this.tasks[index].id:'',
                    'task_id': this.tasks[index].task_id,
                    'task': this.tasks[index].task,
                    'status': this.tasks[index].status,
                    'edit': false,
                    'created_at': this.tasks[index].created_at,
                    'updated_at': new Date(),
                }
                this.updateTask({index, task})
            },
            handleDeleteTask(index) {
                this.setLoading(true)
                this.deleteTask({index});
            },
            onDocumentKeyup(event) {
                if (event.key === "h" && event.altKey) {
                    this.setShowHelp(true)
                }
                if (event.key === "Escape") {
                    this.setShowHelp(false)
                }
            },
        },
        mounted() {
            this.$refs.taskInput.focus()
            this.timer = setInterval(this.updateCurrentDateTime, 1000)
            this.loadTasks()
            this.$nextTick(() => this.showFirstRunIntroIfNeeded())
            window.addEventListener("keyup", this.onDocumentKeyup)
        },
        beforeUnmount() {
            clearInterval(this.timer)
            window.removeEventListener("keyup", this.onDocumentKeyup)
        },
    }
</script>

<template>
    <Header />
    <Footer />
    <Loading />
    <Help />
    <div class="flex flex-row items-start justify-start gap-4 w-[90%] md:w-[60%] lg:w-[40%] text-center">
        <div class="flex flex-col gap-4 w-full">
            <div class="w-full flex flex-col items-center justify-center">
                <span class="text-xs md:text-lg font-PoppinsBold">{{ currentDateTime }}</span>
            </div>
            <div class="w-full h-auto p-4 lg:p-8 flex flex-row gap-4 lg:gap-8 items-center justify-between bg-dark border border-light/80 rounded-2xl shadow-md font-PoppinsBold">
                <div class="text-left pl-1">
                    <p class="font-bold text-xl md:text-2xl text-light">Progress</p>
                    <p class="font-Poppins font-normal text-sm md:text-base text-light/70 mt-1">
                        {{ tasksCompletedCount }} of {{ tasksTotalCount }} completed
                    </p>
                </div>
                <span class="bg-red/90 w-16 h-16 md:w-28 md:h-28 shrink-0 flex items-center justify-center text-dark text-2xl md:text-3xl font-PoppinsBold rounded-full tabular-nums">{{ tasksCompletedCount }}/{{ tasksTotalCount }}</span>
            </div>
            <p class="text-red text-center text-sm flex items-center justify-center gap-2" v-if="showWarning" role="alert">
                <svg class="w-4 h-4 shrink-0 text-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                <span>Enter a task, then press Enter or choose Add.</span>
            </p>
            <div class="relative w-full">
                <input 
                    v-model="taskInput"
                    class="w-full bg-gray text-light font-Poppins p-4 pr-24 outline-none rounded-3xl"
                    type="text" 
                    name="task-input" 
                    id="task-input"
                    placeholder="Add a task…"
                    ref="taskInput"
                    @keypress.enter="handleAddTask"
                />
                <button
                    class="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 bg-red hover:bg-opacity-50 transition-all duration-200 rounded-xl text-dark font-PoppinsBold p-1 pl-4 pr-4"
                    @click="handleAddTask"
                    >
                    Add
                </button>
                <div class="absolute top-1/2 -translate-y-1/2 right-4 hidden lg:flex items-center">
                    <span>Enter</span>
                    <img class="w-8 h-8" src="/src/assets/icons/enter.png" alt="">
                </div>
            </div>
            <div v-if="tasksTotalCount>0" class="tasks flex flex-col w-full h-[40vh] overflow-y-auto overflow-hidden">
                <!-- Pending tasks -->
                <div class="rounded-xl mr-2 bg-dark transition-all duration-500 tasks" v-if="tasksPendingCount>0">
                    <div class="text-red flex flex-row items-end justify-start gap-2 w-full cursor-pointer p-1 select-none" @click="showPending=!showPending">
                        <img v-if="showPending" class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/down-red.png" alt="">
                        <img v-else class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/up-red.png" alt="">
                        <span class="font-PoppinsBold text-md lg:text-xl">
                            Open
                        </span>
                        <span class="text-light/50"> {{ tasksPendingCount }} task{{ tasksPendingCount !== 1 ? 's' : '' }}</span>
                    </div>
                    <div v-if="showPending" class="w-full h-[2px] bg-gray mb-2"></div>
                    <div v-if="showPending" v-for="(item, index) in tasks" :key="index" class="flex flex-row pl-2">
                        <div class="tasks relative flex flex-row flex-wrap items-start justify-start gap-4 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-2 lg:p-4" v-if="!item.status">
                            <label 
                                class="hidden md:block cursor-pointer"
                                :for="'check'+index"
                                aria-label="Mark complete"
                                >
                                <img class="w-7 h-7" src="/src/assets/icons/circle.png" alt="">
                                <input 
                                    type="checkbox" 
                                    v-model="item.status" 
                                    :id="'check' + index" 
                                    class="cursor-pointer w-full" 
                                    @change="handleUpdateTask(index)"
                                />
                            </label>
                            <div class="flex flex-col w-[100%] lg:w-[70%] break-words text-wrap text-start text-lg lg:text-xl">
                                <textarea
                                    v-if="item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full min-h-10"
                                    type="text"
                                    v-model="item.task"
                                    :ref="'task'+index"
                                    />
                                    <label :for="'edit'+index" v-else class="font-PoppinsBold">{{ item.task }}</label>
                                    <div class="flex flex-col w-full">
                                    <span class="w-full break-words text-wrap text-xs md:text-sm  opacity-70">
                                        Added on {{ updateDate(item.created_at) }}
                                    </span>
                                    <span class="w-full break-words text-wrap text-xs md:text-sm opacity-70">
                                        Updated on {{ updateDate(item.updated_at) }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto w-full md:w-auto">
                                <label 
                                    class="block md:hidden cursor-pointer mr-auto"
                                    :for="'check'+index"
                                    aria-label="Mark complete"
                                    >
                                    <img class="w-5 h-5" src="/src/assets/icons/circle.png" alt="">
                                    <input 
                                        type="checkbox" 
                                        v-model="item.status" 
                                        :id="'check' + index" 
                                        class="cursor-pointer w-full" 
                                        @change="handleUpdateTask(index)"
                                    />
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+index" v-model="item.edit">
                                <label v-if="!item.edit" :for="'edit'+index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(index)"
                                >Update</button>
                                <img 
                                    @click="handleDeleteTask(index)" 
                                    class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                    src="/src/assets/icons/delete.png" 
                                    alt=""
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Completed tasks -->
                <div class="flex flex-col rounded-xl mr-2 bg-dark transition-all duration-500 tasks" v-if="tasksCompletedCount>0">
                    <div 
                        class="text-green flex flex-row items-end justify-start gap-2 w-full cursor-pointer p-1 select-none" 
                        @click="showCompleted=!showCompleted"
                        >
                        <img v-if="showCompleted" class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/down-green.png" alt="">
                        <img v-else class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/up-green.png" alt="">
                        <span class="font-PoppinsBold text-md lg:text-xl">
                            Done
                        </span>
                        <span class="text-light/50"> {{ tasksCompletedCount }} task{{ tasksCompletedCount !== 1 ? 's' : '' }}</span>
                    </div>
                    <div v-if="showCompleted" class="w-full h-[2px] bg-gray mb-2"></div>
                    <div v-if="showCompleted" v-for="(item, index) in tasks" :key="index" class="flex flex-row">
                        <div 
                            class="tasks relative flex flex-row flex-wrap items-start justify-start gap-4 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-4" 
                            v-if="item.status"
                            >
                            <label
                                class="hidden md:block cursor-pointer"
                                :for="'check'+index"
                                aria-label="Mark not complete"
                                >
                                <img class="w-9 h-9" src="/src/assets/icons/tick.png" alt="">
                                <input type="checkbox" v-model="item.status" :id="'check' + index" class="cursor-pointer w-full" @change="handleUpdateTask(index)"/>
                            </label>
                            <div class="w-[100%] lg:w-[70%] break-words text-wrap text-start text-lg lg:text-xl">
                                <textarea
                                    v-if="item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full min-h-10"
                                    type="text"
                                    v-model="item.task"
                                    :ref="'task'+index"
                                    />
                                <label :for="'edit'+index" v-else class="line-through">{{ item.task }}</label>
                                <div class="flex flex-col w-full">
                                    <span class="w-96 break-words text-wrap text-xs md:text-sm opacity-70">Added on {{ updateDate(item.created_at) }}</span>
                                    <span class="w-96 break-words text-wrap text-xs md:text-sm opacity-70">Updated on {{ updateDate(item.updated_at) }}</span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto md:w-auto w-full">
                                <label
                                    class="md:hidden block cursor-pointer mr-auto"
                                    :for="'check'+index"
                                    aria-label="Mark not complete"
                                    >
                                    <img class="w-6 h-6 md:w-9 md:h-9" src="/src/assets/icons/tick.png" alt="">
                                    <input type="checkbox" v-model="item.status" :id="'check' + index" class="cursor-pointer w-full" @change="handleUpdateTask(index)"/>
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+index" v-model="item.edit">
                                <label v-if="!item.edit" :for="'edit'+index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(index)"
                                    >Update</button>
                                    <img 
                                    @click="handleDeleteTask(index)" 
                                    class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                    src="/src/assets/icons/delete.png" 
                                    alt=""
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
    input[type="checkbox"] {
        display: none;
    }
    .tasks {
        animation: scaleVertically .3s ease-out;
    }
</style>