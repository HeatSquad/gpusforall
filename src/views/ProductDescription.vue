<template>
    <div>
        <review-display
        :productid="productid"
        >
        </review-display>
    </div>
</template>

<script>
import ReviewDisplay from '../components/ReviewDisplay.vue';

export default {
    components : {
        ReviewDisplay,
    },
    data() {
        return {
            productid : 'P-197',
        }
    },
    created() 
    {
    },
}

</script>