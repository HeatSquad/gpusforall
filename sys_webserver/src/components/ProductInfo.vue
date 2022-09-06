<template>
    <b-container fluid>
        <b-card>
            <b-row no-gutters>
                <h4>
                    {{productObject.product_name}}
                </h4>
            </b-row>
            <b-row no-gutters>
                <b-col md="7">
                    <img :src="require(`../assets/images/products/${productImage}`)" alt="product image"/>
                </b-col>
                <b-col md="5">
                    <div class="h-75">
                        <br>
                        <h5><b>Price:</b> ${{productObject.price}} </h5><br>
                    </div>
                    <div>
                        <span v-if="showError" style="color:red"><b>Not enough inventory to add more</b></span><br>
                        <b-button @click="decreaseCount()">-</b-button>
                        {{count}}
                        <b-button @click="increaseCount()">-</b-button>
                        <br><br>
                        <b-button variant="primary"> Add to Cart </b-button>
                    </div>
                </b-col>
            </b-row>
        </b-card>
        <b-card>
                <b>Manufacturer: </b>{{productObject.manufacturer}}<br>
                <b>Chip Manufacturer: </b>{{productObject.chip_manufacturer}}<br>
                <b>Model: </b>{{productObject.model}}<br>
                <b>Memory Size: </b>{{productObject.memory_size}}<br>
                <b>Memory Type: </b>{{productObject.memory_type}}<br>
                <b>Product Details: </b>{{productObject.description}}
        </b-card>
    </b-container>
</template>

<script>

export default {
    data() {
        return {
            count : 1,
            showError : false,
            imageUrl : '',
        }
    },
    props :
    {
        productObject : Object,
        productImage : String,
    },
    async mounted() 
    {
    },
    methods : 
    {
        decreaseCount()
        {
            if(this.count > 0) this.count--;
            this.showError = false;
        },
        increaseCount()
        {
            if(this.count < this.productObject.inventory) this.count++;
            else this.showError = true;
        },
    }
}
</script>