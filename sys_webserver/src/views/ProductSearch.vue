<template>
    <div>
        <search-display
        :searchString="searchString">
        </search-display>
    </div>
</template>

<script>
import SearchDisplay from '../components/SearchDisplay.vue';

export default {
        components : {
        SearchDisplay,
    },
    data() {
        return {
            searchString : ''
        }
    },
    created(){}
}
</script>

<style>

</style>