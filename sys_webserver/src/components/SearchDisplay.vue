<template>
    <b-container fluid>
        <div>
            <b-row>
                <b-card-group>
                    <b-card class="my-3 mx-2" style="width: 30%" v-for="(item) in productArray" :key="item.productid">
                        <b-row class="justify-content-between">
                            <!-- image will be here -->
                            <b-card-body>
                                <b-card-text><b><a href="http://localhost:8080" target="_blank">{{ item.product_name }}</a></b></b-card-text>
                                <br>
                                <b-card-text><b>{{ item.price }}</b></b-card-text>
                            </b-card-body>
                        </b-row>
                    </b-card>
                </b-card-group>
            </b-row>
        </div>
    </b-container>
</template>

<script>
export default {
    data() {
        return {
            productArray : [],
            perPage : 3,
        }
    },
    props :
    {
    },
    async mounted() 
    {  
        console.log('entered the mounted');
        this.productArray = await this.fetchProducts();
        console.log(this.productArray);
    },
    methods : 
    { // figure out how to specify api calls 
        async fetchProducts() 
        {
            this.total_rows = 10
            const productName = this.$route.params.product_name;
            const apiUrl = `/jsonSearchProduct/${productName}`;
            const jsonFetchReviewsOutput = await this.performGetHttpRequest(apiUrl);
            console.log(`Fetching products.`);
            if (jsonFetchReviewsOutput['status'] != 'SUCCESS') return [];
            console.log(jsonFetchReviewsOutput);
            return jsonFetchReviewsOutput.resultset;
        },
        // formatDate(date)
        // {
        //     const dateEndIndex = date.indexOf('T');
        //     return date.substr(0,dateEndIndex);
        // }

        
        //window.replace(https://searchpage/:bindParam)
    },
    computed : 
    {
        // rows()
        // {
        //     return this.rows 
        // }
        // reviewsForList()
        // {
        //     console.log(this.reviewsArray);
        //     return this.reviewsArray.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
        // },
    }
}
</script>

<style>
a:link {
color: black ;
}
a:hover {
color: blue ;
}
</style>