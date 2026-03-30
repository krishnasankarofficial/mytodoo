<template>
    <div class="text-center fixed text-xs lg:text-sm bottom-0 w-full h-10 bg-dark flex flex-row items-center justify-center gap-4 p-8 z-50">
        <span class="font-PoppinsBold flex-1 text-start">&copy;2024</span>
        <span>Made with &#10084;&#65039; By <a href="https://krishnasankar.vercel.app" target="_blank" class="cursor-pointer font-PoppinsBold hover:text-red transition-all duration-200 lg:text-lg">Krishnasankar</a></span>
        <div class="flex items-center justify-end flex-1">
            <input type="checkbox" name="showHelp" id="showHelp" v-model="help" class="sr-only">
            <label for="showHelp" class="flex cursor-pointer items-center justify-center rounded-full bg-light bg-opacity-10 font-PoppinsBold text-red transition-opacity hover:bg-opacity-20 w-8 h-8 text-xl lg:h-10 lg:w-10 lg:text-2xl" title="Help">?</label>
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
        help(val) {
            this.setShowHelp(val)
        },
        showHelp(val) {
            if (this.help !== val) {
                this.help = val
            }
        },
    },
    methods: {
        ...mapActions(['setShowHelp'])
    },
}
</script>
