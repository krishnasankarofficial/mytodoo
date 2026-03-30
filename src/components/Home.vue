<script>
    import Header from './Header.vue'
    import Footer from './Footer.vue'
    import moment from 'moment'
    import Loading from './Loading.vue'
    import Help from './Help.vue'

    import { mapState, mapGetters, mapActions } from 'vuex'

    const INTRO_STORAGE_KEY = 'stride_intro_seen'

    const PRIORITY_ORDER = { none: 0, low: 1, medium: 2, high: 3 }

    const PRIORITY_OPTIONS = [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
        { value: 'none', label: 'None' },
    ]

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
                newTaskPriority: 'medium',
                searchQuery: '',
                showPending: true,
                showCompleted: true,
                showWarning: false,
                priorityOptions: PRIORITY_OPTIONS,
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
            ]),
            searchActive() {
                return Boolean(this.searchQuery.trim())
            },
            openRows() {
                const q = this.searchQuery.trim().toLowerCase()
                const rows = this.tasks
                    .map((item, index) => ({ item, index }))
                    .filter(({ item }) => !item.status)
                    .filter(({ item }) => !q || String(item.task).toLowerCase().includes(q))
                rows.sort(
                    (a, b) =>
                        (PRIORITY_ORDER[b.item.priority] ?? 0) - (PRIORITY_ORDER[a.item.priority] ?? 0),
                )
                return rows
            },
            doneRows() {
                const q = this.searchQuery.trim().toLowerCase()
                return this.tasks
                    .map((item, index) => ({ item, index }))
                    .filter(({ item }) => item.status)
                    .filter(({ item }) => !q || String(item.task).toLowerCase().includes(q))
                    .sort(
                        (a, b) =>
                            new Date(b.item.updated_at) - new Date(a.item.updated_at),
                    )
            },
        },
        methods: {
            ...mapActions([
                'loadTasks',
                'saveTasksLocal',
                'addTask',
                'updateTask',
                'deleteTask',
                'setLoading',
                'setShowHelp',
                'setNotification',
                'clearCompleted',
                'importTasksFromJson',
            ]),
            priorityClass(priority) {
                const map = {
                    high: 'text-red border-red/50',
                    medium: 'text-amber-400 border-amber-400/40',
                    low: 'text-light/80 border-light/30',
                    none: 'text-light/50 border-light/20',
                }
                return map[priority] || map.none
            },
            priorityShort(priority) {
                const map = { high: 'High', medium: 'Med', low: 'Low', none: '—' }
                return map[priority] || '—'
            },
            taskPayload(index, overrides = {}) {
                const t = this.tasks[index]
                return {
                    id: t.id ? t.id : '',
                    task_id: t.task_id,
                    task: t.task,
                    status: t.status,
                    edit: false,
                    priority: t.priority ?? 'none',
                    created_at: t.created_at,
                    updated_at: new Date(),
                    ...overrides,
                }
            },
            setTaskPriority(index, event) {
                const priority = event.target.value
                this.setLoading(true)
                this.updateTask({
                    index,
                    task: this.taskPayload(index, { priority, updated_at: new Date() }),
                })
            },
            confirmClearCompleted() {
                if (!this.tasksCompletedCount) return
                if (
                    !window.confirm(
                        `Remove ${this.tasksCompletedCount} completed task(s)? This cannot be undone.`,
                    )
                ) {
                    return
                }
                this.setLoading(true)
                this.clearCompleted()
            },
            exportBackup() {
                const serializable = this.tasks.map((t) => ({
                    ...t,
                    created_at: t.created_at instanceof Date ? t.created_at.toISOString() : t.created_at,
                    updated_at: t.updated_at instanceof Date ? t.updated_at.toISOString() : t.updated_at,
                }))
                const blob = new Blob([JSON.stringify(serializable, null, 2)], {
                    type: 'application/json',
                })
                const a = document.createElement('a')
                const stamp = new Date().toISOString().slice(0, 10)
                a.href = URL.createObjectURL(blob)
                a.download = `stride-tasks-${stamp}.json`
                a.click()
                URL.revokeObjectURL(a.href)
                this.setNotification({ message: 'Backup downloaded.', type: 'normal' })
            },
            triggerImport() {
                this.$refs.importFile?.click()
            },
            async onImportFile(event) {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (!file) return
                const text = await file.text()
                try {
                    if (!window.confirm('Replace all current tasks with this file?')) return
                    await this.importTasksFromJson(text)
                    this.setNotification({ message: 'Tasks imported.', type: 'normal' })
                } catch (e) {
                    const message =
                        e && typeof e.message === 'string'
                            ? e.message
                            : 'Could not import file. Check JSON format.'
                    this.setNotification({ message, type: 'error' })
                }
            },
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
                        task_id: this.nextTaskId,
                        task: this.taskInput.trim(),
                        status: false,
                        edit: false,
                        priority: this.newTaskPriority,
                        created_at: new Date(),
                        updated_at: new Date(),
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
                const task = this.taskPayload(index)
                this.updateTask({ index, task })
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
            <div class="flex flex-col sm:flex-row gap-2 w-full items-stretch">
                <label class="sr-only" for="new-priority">Priority for new task</label>
                <select
                    id="new-priority"
                    v-model="newTaskPriority"
                    class="shrink-0 bg-gray text-light font-Poppins text-sm border border-light/20 rounded-2xl px-3 py-3 outline-none focus:border-red/60"
                >
                    <option v-for="opt in priorityOptions" :key="'np-'+opt.value" :value="opt.value">
                        {{ opt.label }}
                    </option>
                </select>
                <div class="relative w-full min-w-0">
                <input 
                    v-model="taskInput"
                    class="w-full bg-gray text-light font-Poppins p-4 pr-24 outline-none rounded-3xl border border-transparent focus:border-light/30"
                    type="text" 
                    name="task-input" 
                    id="task-input"
                    placeholder="Add a task…"
                    ref="taskInput"
                    @keypress.enter="handleAddTask"
                />
                <button
                    type="button"
                    class="lg:hidden absolute top-1/2 -translate-y-1/2 right-3 bg-red hover:bg-opacity-50 transition-all duration-200 rounded-xl text-dark font-PoppinsBold p-1 pl-4 pr-4"
                    @click="handleAddTask"
                    >
                    Add
                </button>
                <div class="absolute top-1/2 -translate-y-1/2 right-4 hidden lg:flex items-center pointer-events-none text-light/50 text-sm gap-1">
                    <span>Enter</span>
                    <img class="w-8 h-8 opacity-70" src="/src/assets/icons/enter.png" alt="">
                </div>
                </div>
            </div>
            <div class="flex flex-col gap-2 w-full mb-3 text-left">
                <label class="sr-only" for="task-search">Search tasks</label>
                <input
                    id="task-search"
                    v-model="searchQuery"
                    type="search"
                    autocomplete="off"
                    placeholder="Search tasks…"
                    class="w-full bg-gray/80 text-light font-Poppins text-sm px-4 py-2.5 rounded-xl border border-light/15 outline-none focus:border-light/40 placeholder:text-light/40"
                />
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <div class="flex flex-wrap gap-2">
                        <button
                            type="button"
                            class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 text-light hover:bg-gray transition-colors"
                            @click="exportBackup"
                        >
                            Export JSON
                        </button>
                        <button
                            type="button"
                            class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-light/25 text-light hover:bg-gray transition-colors"
                            @click="triggerImport"
                        >
                            Import JSON
                        </button>
                    </div>
                    <button
                        type="button"
                        class="text-xs font-PoppinsBold px-3 py-1.5 rounded-lg border border-red/40 text-red hover:bg-red/10 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                        :disabled="tasksCompletedCount === 0"
                        @click="confirmClearCompleted"
                    >
                        Clear done
                    </button>
                </div>
                <input
                    ref="importFile"
                    type="file"
                    accept="application/json,.json"
                    class="sr-only"
                    aria-hidden="true"
                    @change="onImportFile"
                />
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
                    <p v-if="showPending && tasksPendingCount > 0 && openRows.length === 0" class="text-sm text-light/60 py-2 text-left px-1">
                        No open tasks match your search.
                    </p>
                    <div v-if="showPending" v-for="row in openRows" :key="'open-'+row.index" class="flex flex-row pl-2">
                        <div class="tasks relative flex flex-row flex-wrap items-start justify-start gap-3 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-2 lg:p-4">
                            <label 
                                class="hidden md:block cursor-pointer shrink-0"
                                :for="'check'+row.index"
                                aria-label="Mark complete"
                                >
                                <img class="w-7 h-7" src="/src/assets/icons/circle.png" alt="">
                                <input 
                                    type="checkbox" 
                                    v-model="row.item.status" 
                                    :id="'check' + row.index" 
                                    class="cursor-pointer w-full" 
                                    @change="handleUpdateTask(row.index)"
                                />
                            </label>
                            <div class="flex flex-col w-[100%] lg:w-[55%] break-words text-wrap text-start text-lg lg:text-xl min-w-0">
                                <div class="flex flex-wrap items-center gap-2 mb-1">
                                    <label class="sr-only" :for="'prio-'+row.index">Priority</label>
                                    <select
                                        :id="'prio-'+row.index"
                                        :value="row.item.priority"
                                        class="text-[11px] font-Poppins bg-gray border border-light/20 rounded-lg px-2 py-1 max-w-[6rem] shrink-0"
                                        @change="setTaskPriority(row.index, $event)"
                                    >
                                        <option v-for="opt in priorityOptions" :key="'p-'+row.index+'-'+opt.value" :value="opt.value">
                                            {{ opt.label }}
                                        </option>
                                    </select>
                                </div>
                                <textarea
                                    v-if="row.item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full min-h-10"
                                    type="text"
                                    v-model="row.item.task"
                                    :ref="'task'+row.index"
                                    />
                                    <label :for="'edit'+row.index" v-else class="font-PoppinsBold">{{ row.item.task }}</label>
                                    <div class="flex flex-col w-full">
                                    <span class="w-full break-words text-wrap text-xs md:text-sm  opacity-70">
                                        Added on {{ updateDate(row.item.created_at) }}
                                    </span>
                                    <span class="w-full break-words text-wrap text-xs md:text-sm opacity-70">
                                        Updated on {{ updateDate(row.item.updated_at) }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto w-full md:w-auto">
                                <label 
                                    class="block md:hidden cursor-pointer mr-auto"
                                    :for="'check'+row.index"
                                    aria-label="Mark complete"
                                    >
                                    <img class="w-5 h-5" src="/src/assets/icons/circle.png" alt="">
                                    <input 
                                        type="checkbox" 
                                        v-model="row.item.status" 
                                        :id="'check' + row.index" 
                                        class="cursor-pointer w-full" 
                                        @change="handleUpdateTask(row.index)"
                                    />
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+row.index" v-model="row.item.edit">
                                <label v-if="!row.item.edit" :for="'edit'+row.index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(row.index)"
                                >Save</button>
                                <img 
                                    @click="handleDeleteTask(row.index)" 
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
                    <p v-if="showCompleted && tasksCompletedCount > 0 && doneRows.length === 0" class="text-sm text-light/60 py-2 text-left px-1">
                        No completed tasks match your search.
                    </p>
                    <div v-if="showCompleted" v-for="row in doneRows" :key="'done-'+row.index" class="flex flex-row">
                        <div 
                            class="tasks relative flex flex-row flex-wrap items-start justify-start gap-4 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-4"
                            >
                            <label
                                class="hidden md:block cursor-pointer shrink-0"
                                :for="'check'+row.index"
                                aria-label="Mark not complete"
                                >
                                <img class="w-9 h-9" src="/src/assets/icons/tick.png" alt="">
                                <input type="checkbox" v-model="row.item.status" :id="'check' + row.index" class="cursor-pointer w-full" @change="handleUpdateTask(row.index)"/>
                            </label>
                            <div class="w-[100%] lg:w-[70%] break-words text-wrap text-start text-lg lg:text-xl min-w-0">
                                <span
                                    v-if="row.item.priority && row.item.priority !== 'none'"
                                    class="inline-block text-[10px] uppercase tracking-wide mb-1 px-2 py-0.5 rounded border"
                                    :class="priorityClass(row.item.priority)"
                                >
                                    {{ priorityShort(row.item.priority) }}
                                </span>
                                <textarea
                                    v-if="row.item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full min-h-10"
                                    type="text"
                                    v-model="row.item.task"
                                    :ref="'task'+row.index"
                                    />
                                <label :for="'edit'+row.index" v-else class="line-through block">{{ row.item.task }}</label>
                                <div class="flex flex-col w-full">
                                    <span class="w-full max-w-full break-words text-wrap text-xs md:text-sm opacity-70">Added on {{ updateDate(row.item.created_at) }}</span>
                                    <span class="w-full max-w-full break-words text-wrap text-xs md:text-sm opacity-70">Updated on {{ updateDate(row.item.updated_at) }}</span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto md:w-auto w-full">
                                <label
                                    class="md:hidden block cursor-pointer mr-auto shrink-0"
                                    :for="'check'+row.index"
                                    aria-label="Mark not complete"
                                    >
                                    <img class="w-6 h-6 md:w-9 md:h-9" src="/src/assets/icons/tick.png" alt="">
                                    <input type="checkbox" v-model="row.item.status" :id="'check' + row.index" class="cursor-pointer w-full" @change="handleUpdateTask(row.index)"/>
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+row.index" v-model="row.item.edit">
                                <label v-if="!row.item.edit" :for="'edit'+row.index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(row.index)"
                                    >Save</button>
                                    <img 
                                    @click="handleDeleteTask(row.index)" 
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