<template>
    <b-container fluid>
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
        userid : String,
    },
    async mounted() 
    {  
        this.reviewsArray = await this.fetchReviews();
        console.log(this.reviewsArray);
    },
    methods : 
    {
        async fetchReviews() 
        {
            console.log(`Fetching reviews for ${this.productid}`);
            const apiUrl = `/services/jsonFetchReviewsByProductID/${this.productid}/${this.userid}`;
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