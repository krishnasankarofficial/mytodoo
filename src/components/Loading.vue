<template>
    <div v-show="loading" class="loading fixed w-[100vw] h-[100vh] top-0 z-50 m-0 flex flex-col items-center justify-center gap-2 bg-black bg-opacity-80">
        <span v-show="syncing">Syncing</span>
       <div class="w-8 h-8 rounded-full border-4 border-light border-t-red animate-spin"></div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    
    export default {
        computed: {
            ...mapState({
                syncing: state => state.syncing,
                loading: state => state.loading,
            })
        },
    }
</script>
