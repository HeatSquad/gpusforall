<template>
    <b-container fluid>
        <h3>My Reviews</h3>
        <b-card v-for="item in reviewsForList" :key="item.reviewid">
            <b-row class="justify-content-between">
                <p><b>{{ item.first_name }} {{ item.last_name }}</b></p> 
                <p style="text-align:right"><i>{{ formatDate(item.review_modified) }}</i></p>
            </b-row>
            <h4> {{item.title}} </h4>
            <p>{{item.text}}</p>
            <b-row v-if="item.imgArray.length != 0">
                <span v-for="img in item.imgArray" :key="img.imageid">
                    <img :src="img.image" style="padding:25px">
                </span>
            </b-row>
            <b-row class="float-right">
                <b-button variant="success" size="sm" @click="editReview(item)">Edit</b-button>
                <b-button variant="danger" size="sm" @click="confirmDelete(item.reviewid)">Delete</b-button>
            </b-row>
        </b-card>
        <b-row class="justify-content-center">
            <b-pagination
            v-model="currentPage"
            :total-rows="reviewsArray.length"
            :per-page="perPage"
            aria-controls="reviewsList"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            size="sm"
            ></b-pagination>
        </b-row>
        <b-modal ref="deleteModal" 
                title="Delete Review?"
                okTitle="Yes"
                cancelTitle="No"
                cancel-variant="danger"
                ok-variant="success"
                id="testing"
                hide-header-close
                @ok="deleteReview()"
                @cancel="cancelDelete()">
            Are you sure you want to delete this review?
        </b-modal>
        <b-modal
            ref="deletedModal"
            title="Success!"
            ok-only
        >
        Review has been successfully deleted!
        </b-modal>
        <b-modal
            ref="editModal"
            title="Edit Review"
            hide-footer>
            <edit-review
                :reviewData="selectedReviewInfo"
                @close="hideEditModal()"
                @success="refreshPage()"
            />
        </b-modal>
    </b-container>
</template>

<script>
import EditReview from "../components/EditReview.vue";

export default {
    components: {
        EditReview,
    },
    data() {
        return {
            userid: 'USR00001',
            reviewsArray: [],
            currentPage : 1,
            perPage : 5,
            selectedReview: '',
            selectedReviewInfo: {},
        }
    },
    async mounted() 
    {
        this.reviewsArray = await this.fetchUsersReviews();
        console.log(this.reviewsArray);
    },
    methods : 
    {
        async fetchUsersReviews() 
        {
            console.log(`Fetching user reviews for ${this.userid}`);
            const apiUrl = `/services/jsonFetchReviewsByUserID/${this.userid}`;
            const jsonFetchReviewsOutput = await this.performGetHttpRequest(apiUrl);
            console.log(jsonFetchReviewsOutput);
            if (jsonFetchReviewsOutput['status'] != 'SUCCESS') return [];
            return await this.mapReviews(jsonFetchReviewsOutput.resultset);
        },
        formatDate(date)
        {
            const dateEndIndex = date.indexOf('T');
            return date.substr(0,dateEndIndex);
        },
        async mapReviews(reviewsList)
        {
            const reviewObject = {};
            reviewsList.forEach(function(reviews)
            {
                const reviewid = reviews.reviewid;
                const imgObject = {};
                if(reviews.imageid) imgObject['imageid'] = reviews.imageid;
                if(reviews.image) imgObject['image'] = reviews.image;
                if(reviews.image_created) imgObject['created'] = reviews.image_created;
                if(reviews.image_created_by) imgObject['created_by'] = reviews.image_created_by;
                if(reviews.image_modified) imgObject['modified'] = reviews.image_modified;
                if(reviews.image_modified_by) imgObject['modified_by'] = reviews.image_modified_by;

                if(!reviewObject[reviewid]) 
                {
                    delete reviews.imageid;
                    delete reviews.image;
                    delete reviews.image_created;
                    delete reviews.image_created_by;
                    delete reviews.image_modified;
                    delete reviews.image_modified_by;
                    reviews.imgArray = [];
                    reviewObject[reviewid] = reviews;
                }

                if(Object.keys(imgObject).length > 0) reviewObject[reviewid].imgArray.push(imgObject);
            });

            return Object.values(reviewObject);
        },
        confirmDelete(reviewid)
        {
            this.$refs.deleteModal.show();
            this.selectedReview = reviewid;
        },
        async deleteReview()
        {
            console.log(`Deleting user reviews for ${this.selectedReview}`);
            const params = {};
            params['reviewid'] = this.selectedReview;
            const apiUrl = `/services/jsonDeleteReviewsByReviewID`;
            const jsonFetchReviewsOutput = await this.performPutHttpRequest(apiUrl, params);
            console.log(jsonFetchReviewsOutput);
            if (jsonFetchReviewsOutput['status'] != 'SUCCESS') console.log("Failed to delete review");
            this.reviewsArray = await this.fetchUsersReviews();
            this.$refs.deletedModal.show();
        },
        cancelDelete()
        {
            this.selectedReview = '';
        },
        editReview(reviewInfo)
        {
            this.$refs.editModal.show();
            this.selectedReviewInfo = JSON.parse(JSON.stringify(reviewInfo)); //create a deep copy
        },
        hideEditModal()
        {
            this.$refs.editModal.hide();
            this.selectedReviewInfo = {};
        },
        async refreshPage()
        {
            this.hideEditModal();
            this.reviewsArray = await this.fetchUsersReviews();
        }
    },
    computed : 
    {
        reviewsForList()
        {
            console.log(this.reviewsArray);
            return this.reviewsArray.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
        },
    }
}

</script>