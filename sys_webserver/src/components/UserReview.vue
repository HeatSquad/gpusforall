<template>
    <b-container fluid>
        <h3>Existing Review</h3>
        <b-card>
            <b-row class="justify-content-between">
                <p><b>{{ review.first_name }} {{ review.last_name }}</b></p> 
                <p style="text-align:right"><i>{{ formatDate(review.review_modified) }}</i></p>
            </b-row>
            <h4> {{review.title}} </h4>
            <p>{{review.text}}</p>
            <b-row v-if="review.imgArray && review.imgArray.length != 0">
                <span v-for="img in review.imgArray" :key="img.imageid">
                    <img :src="img.image" style="padding:25px">
                </span>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            review : {},
        }
    },
    props :
    {
        productid : String,
        userid : String,
    },
    async mounted() 
    {
        this.review = await this.fetchReview();
        if(this.review.length === 0)
        {
            this.$emit('show-write-review');
        }
        else
        {
            this.review = this.review[0];
            console.log(this.review);
        }
    },
    methods : 
    {
        async fetchReview()
        {
            console.log(`Fetching review for ${this.productid} for user ${this.userid}`);
            const apiUrl = `/jsonFetchReviewsByUserAndProduct/${this.productid}/${this.userid}`;
            const jsonFetchReviewsOutput = await this.performGetHttpRequest(apiUrl);
            console.log(jsonFetchReviewsOutput);
            if (jsonFetchReviewsOutput['status'] != 'SUCCESS') return [];
            return await this.mapReview(jsonFetchReviewsOutput.resultset);
        },
        formatDate(date)
        {
            if(!date) return;
            const dateEndIndex = date.indexOf('T');
            return date.substr(0,dateEndIndex);
        },
        async mapReview(review)
        {
            const reviewObject = {};
            review.forEach(function(reviews)
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
}

</script>