<template>
    <div>
        <review-display
            :productid="productid"
            :userid="userid"
        >
        </review-display>
        <write-review
            v-if="noCurrentReview"
            :productid="productid"
            :userid="userid"
        >
        </write-review>
        <user-review
            v-if="!noCurrentReview"
            :productid="productid"
            :userid="userid"
            @show-write-review="showWriteReview"
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
            noCurrentReview: false,
        }
    },
    created() 
    {
    },
    methods:
    {
        showWriteReview()
        {
            this.noCurrentReview = true;
        },
    }
}

</script>