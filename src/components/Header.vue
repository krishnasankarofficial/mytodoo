<template>
    <div class="fixed top-0 w-full h-20 bg-dark flex flex-row items-center justify-between z-50">
        <h1 class="text-xl lg:text-2xl font-PoppinsBold ml-4 lg:ml-8">My<span class="text-red">Todoo</span></h1>
        <input type="checkbox" name="online" id="online-status" v-model="onlineStatus">
        <label 
            v-if="onlineStatus" 
            for="online-status" 
            class="flex flex-row gap-2 items-center justify-center cursor-pointer font-PoppinsBold text-green mr-4 lg:mr-8"
        >
            <div class="w-6 lg:w-10 h-3 lg:h-5 rounded-full bg-light flex items-center justify-end p-[3px] lg:p-1 bg-opacity-20">
                <div class="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-green"></div>
            </div>
            Online
        </label>
        <label 
            v-else 
            for="online-status" 
            class="flex 
            flex-row gap-2 items-center justify-center cursor-pointer font-PoppinsBold text-red mr-4 lg:mr-8"
        >
            <div class="w-6 lg:w-10 h-3 lg:h-5 rounded-full bg-light flex items-center justify-start p-[3px] lg:p-1 bg-opacity-20">
                <div class="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-red"></div>
            </div>
            Offline
        </label>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    
    export default {
        data() {
            return {
                onlineStatus: false,
            }
        },
        computed: {
            ...mapState({
                online: state => state.online,
                loading: state => state.loading,
            })
        },
        watch: {
            onlineStatus(){
                this.setLoading(true)
                this.updateOnlineStatus(this.onlineStatus)
                this.loadTasks()
            }
        },
        methods: {
            ...mapActions(['updateOnlineStatus', 'loadTasks', 'setLoading'])
        },
        mounted() {
            this.updateOnlineStatus(false)
            this.setLoading(true)
            this.loadTasks()
        },
    }
</script>

<style>
    input[type="checkbox"]{
        display: none;
    }
</style>