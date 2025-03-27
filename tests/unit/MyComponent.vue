<template>
    <div>
        <button @click="increment">{{ count }}</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
        };
    },
    methods: {
        increment() {
            this.count++;
        },
    },
};
</script>
