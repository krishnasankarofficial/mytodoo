<template>
    <div 
        ref="notification" 
        class="fixed top-0 w-full h-full bg-dark bg-opacity-55 z-50 flex items-start justify-center pt-10" 
        v-show="showWelcome"
    >
        <div 
            class="notify relative bg-gray text-light font-PoppinsBold text-md md:text-2xl min-w-40 lg:min-w-52 h-auto p-4 lg:p-6 rounded-xl shadow-xl shadow-dark text-center"
             >
            <div class="absolute top-1 left-1/2 -translate-x-1/2 w-32 h-2 flex flex-row justify-between">
                <div class="bg-dark w-2 h-3 rounded-full border-2 border-light border-l-0 relative">
                    <div class="absolute bottom-1 left-1/2 -translate-x-1/2 h-20 w-[2px] bg-light rounded-full"></div>
                </div>
                <div class="bg-dark w-2 h-3 rounded-full border-2 border-light border-l-0 relative">
                    <div class="absolute bottom-1 left-1/2 -translate-x-1/2 h-20 w-[2px] bg-light rounded-full"></div>
                </div>
            </div>
            <span class="font-PoppinsBold text-sm md:text-xl flex flex-col gap-0">
                <span>Welcome to My<span class="text-red">Todo</span> App.</span>
                <span>Have a Nice Day &#128522;</span>
            </span>
        </div>
    </div>
</template> 

<script>
export default {
    data() {
        return {
            showWelcome: true,       
        }
    },
    mounted() {
        setTimeout(() => {
            this.showWelcome = false
        }, 2000);
    },
}
</script>

<style>
 .notify {
    animation: dropDown 1s ease-in-out forwards;
 }
</style>