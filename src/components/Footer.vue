<template>
    <div class="text-center fixed text-xs lg:text-sm bottom-0 w-full h-10 bg-dark flex flex-row items-center justify-center gap-4 p-8 z-50">
        <span class="font-PoppinsBold flex-1 text-start">&copy;2024</span>
        <span>Made with &#10084;&#65039; By <a href="https://krishnasankar.vercel.app" target="_blank" class="cursor-pointer font-PoppinsBold hover:text-red transition-all duration-200 lg:text-lg">Krishnasankar</a></span>
        <span class="hidden lg:block text-sm flex-1 text-end">Press <span class="bg-gray p-1 rounded-lg font-PoppinsBold">[Alt + h]</span> for Help </span>
        <div class="lg:hidden flex items-center justify-end flex-1">
            <input type="checkbox" name="showHelp" id="showHelp" v-model="help">
            <label for="showHelp" class="text-lg font-PoppinsBold bg-light bg-opacity-10 text-red w-6 h-6 rounded-full">?</label>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'


export default {
    data() {
        return {
            help:false,
        }
    },
    computed: {
        ...mapState({
            showHelp: state => state.showHelp,
        })
    },
    watch: {
        help(){
            this.setShowHelp(this.help)
        }
    },
    methods: {
        ...mapActions(['setShowHelp'])
    },
}
</script>
