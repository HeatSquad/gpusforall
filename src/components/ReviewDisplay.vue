<template>
    <b-container fluid>
        <b-card v-for="item in reviewsForList" :key="item">
            <b-row class="justify-content-between">
                <p><b>{{ item.first_name }} {{ item.last_name }}</b></p> 
                <p style="text-align:right"><i>{{ formatDate(item.review_modified) }}</i></p>
            </b-row>
            <h4> {{item.title}} </h4>
            <p>{{item.text}}</p>
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
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            currentPage : 1,
            perPage : 3,
            reviewsArray : [],
        }
    },
    props :
    {
        productid : String,
    },
    async mounted() 
    {  
        this.reviewsArray = await this.fetchReviews();
    },
    methods : 
    {
        async fetchReviews() 
        {
            console.log(`Fetching reviews for ${this.productid}`);
            const apiUrl = `/jsonFetchReviewsByProductID/${this.productid}`;
            const jsonFetchReviewsOutput = await this.performGetHttpRequest(apiUrl);
            console.log(jsonFetchReviewsOutput);
            if (jsonFetchReviewsOutput['status'] != 'SUCCESS') return [];
            return jsonFetchReviewsOutput.resultset;
        },
        formatDate(date)
        {
            const dateEndIndex = date.indexOf('T');
            return date.substr(0,dateEndIndex);
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