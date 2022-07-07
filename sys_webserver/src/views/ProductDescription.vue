<template>
    <div>
        <review-display
            :productid="productid"
        >
        </review-display>
        <write-review
            :productid="productid"
            :userid="userid"
        >
        </write-review>
        <user-review
            :productid="productid"
            :userid="userid"
        >
        </user-review>
    </div>
</template>

<script>
import ReviewDisplay from '../components/ReviewDisplay.vue';
import WriteReview from '../components/WriteReview.vue';
import UserReview from '../components/UserReview.vue';

export default {
    components : {
        ReviewDisplay,
        WriteReview,
        UserReview,
    },
    data() {
        return {
            productid : 'P-197',
            userid : 'USR00001',
        }
    },
    created() 
    {
    },
}

</script>