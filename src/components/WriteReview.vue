<template>
    <b-container fluid>
        <h2>Write a review</h2>
        <input
            id="titleTextBox"
            v-model="title"
            placeholder="Title..."
            class="form-control form-control-md"
        >
        <b-form-textarea
            id="reviewTextBox"
            v-model="review"
            placeholder="Write a review..."
            rows="4"
            max-rows="10"
        >
        </b-form-textarea>
        <span 
            v-if="showError"
            style="color:red">
            {{ errorMessage }}
        </span>
        <span 
            v-if="showSuccess"
            style="color:green">
            {{ successMessage }}
        </span>
        <br>
        <b-row class="float-right">
            <b-button
                variant="secondary"
                @click="resetReviews()"
            >
                Clear
            </b-button>
            <b-button
                variant="primary"
                @click="submitReview()"
            >
                Submit
            </b-button>
        </b-row>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            review : '',
            title : '',
            showError : false,
            errorMessage : '',
            showSuccess : false,
            successMessage : '',
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
    },
    methods : 
    {
        async submitReview()
        {
            this.errorMessage = '';
            this.showError = false;
            console.log(`Inserting review for ${this.productid}`);
            const params = {};
            params['productid'] = this.productid;
            params['userid'] = this.userid;
            params['title'] = this.title;
            params['text'] = this.review;
            const apiUrl = `/jsonSubmitReviews`;
            const jsonSubmitOutput = await this.performPostHttpRequest(apiUrl, params);
            console.log(jsonSubmitOutput);
            if (jsonSubmitOutput['status'] != 'SUCCESS')
            {
                this.errorMessage = `Unable to submit review. Please try again later.`;
                this.showError = true;
                return;
            }
            this.successMessage = `Successfully submitted!`;
            this.showSuccess = true;
            this.title = '';
            this.review = '';
            return jsonSubmitOutput.status;
        },
        async resetReviews()
        {
            this.title = '';
            this.review = '';
            this.errorMessage = '';
            this.showError = false;
            this.successMessage = '';
            this.showSuccess = false;
        }
    },
    computed : 
    {
    }
}

</script>